import { inngest } from "./client";
import {
    createAgent,
    createTool,
    createNetwork,
    Tool,
    Message,
    createState,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import z from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import { prisma } from "@/lib/db";
import { openai } from "inngest";
import { logEvent } from "@/lib/logger";

/* -------------------- TYPES -------------------- */

type LLMOverrides = {
    max_tokens?: number;
    temperature?: number;
};

/* -------------------- HELPERS -------------------- */

function extractTextFromMessages(messages?: Message[]) {
    if (!messages) return null;
    for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (msg.type === "text") {
            return Array.isArray(msg.content) ? msg.content.join("") : msg.content;
        }
    }
    return null;
}

const withTimeout = <T>(p: Promise<T>, ms = 30_000) =>
    Promise.race([
        p,
        new Promise<T>((_, r) =>
            setTimeout(() => r(new Error("LLM timeout")), ms)
        ),
    ]);

/* -------------------- GROQ -------------------- */

const GROQ_KEYS = [
    process.env.GROQ_KEY_1,
    process.env.GROQ_KEY_2,
    process.env.GROQ_KEY_3,
    process.env.GROQ_KEY_4,
    process.env.GROQ_KEY_5,
].filter(Boolean);

let groqKeyIndex = 0;
let groqModelIndex = 0;
let groqDownUntil = 0;

const GROQ_MODELS = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "llama-3.3-70b-versatile",
];

function getGroqKey() {
    const key = GROQ_KEYS[groqKeyIndex];
    groqKeyIndex = (groqKeyIndex + 1) % GROQ_KEYS.length;
    return key;
}

function canUseGroq() {
    return Date.now() > groqDownUntil;
}

/* -------------------- OPENROUTER -------------------- */

function requireOpenRouterKey() {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) throw new Error("OPENROUTER_API_KEY missing");
    return key;
}

const OPENROUTER_MODELS = [
    "kwaipilot/kat-coder-pro:free"
];

let openRouterIndex = 0;

function getOpenRouterModel() {
    const model = OPENROUTER_MODELS[openRouterIndex];
    openRouterIndex = (openRouterIndex + 1) % OPENROUTER_MODELS.length;
    logEvent({ type: "model_selected", model });
    return model;
}

/* -------------------- FUNCTION -------------------- */

export const codeAgentFunction = inngest.createFunction(
    { id: "code-agent" },
    { event: "code-agent/run" },
    async ({ event, step }) => {
        /* 🔒 per-request OpenRouter model lock */
        const lockedOpenRouterModel = getOpenRouterModel();

        function openRouterLLM(extra?: LLMOverrides) {
            return openai({
                baseUrl: "https://openrouter.ai/api/v1",
                apiKey: requireOpenRouterKey(),
                model: lockedOpenRouterModel,
                defaultParameters: {
                    max_tokens: 8000,
                    temperature: 0.2,
                    ...extra,
                },
            });
        }

        function getLLM() {
            if (canUseGroq() && GROQ_KEYS.length) {
                try {
                    const model = GROQ_MODELS[groqModelIndex];
                    groqModelIndex = (groqModelIndex + 1) % GROQ_MODELS.length;

                    logEvent({ type: "llm_selected", provider: "groq", model });

                    return openai({
                        baseUrl: "https://api.groq.com/openai/v1",
                        apiKey: getGroqKey(),
                        model,
                        defaultParameters: {
                            max_tokens: 8000,
                            temperature: 0.2,
                        },
                    });
                } catch (e) {
                    groqDownUntil = Date.now() + 60_000;
                    logEvent({ type: "groq_down", error: String(e) });
                }
            }

            logEvent({
                type: "llm_fallback",
                provider: "openrouter",
                model: lockedOpenRouterModel,
            });

            return openRouterLLM();
        }

        /* -------------------- SANDBOX -------------------- */

        const sandboxId = await step.run("sandbox", async () => {
            const sandbox = await Sandbox.create("aura-test-project");
            const ttl = event.data.isPro ? 30 : 10;
            await sandbox.setTimeout(60_000 * ttl);
            return sandbox.sandboxId;
        });

        /* -------------------- STATE -------------------- */

        const state = createState(
            { summary: "", files: {} },
            { messages: [] }
        );

        /* -------------------- CODE AGENT -------------------- */

        const codeAgent = createAgent({
            name: "code-agent",
            system: PROMPT,
            model: getLLM(),
            tools: [
                createTool({
                    name: "terminal",
                    description:
                        "Run shell commands inside the sandboxed Next.js project. Use this ONLY for installing dependencies or running one-off commands. Never start or restart dev servers.",
                    parameters: z.object({
                        command: z.string().describe("Shell command to execute"),
                    }),
                    handler: async ({ command }) => {
                        const sandbox = await getSandbox(sandboxId);
                        const result = await sandbox.commands.run(command);
                        return result.stdout;
                    },
                }),

                createTool({
                    name: "createOrUpdateFiles",
                    description:
                        "Create new files or update existing files in the project. Use this for ALL code changes. Paths must be relative (e.g. app/page.tsx). Never modify config or lock files.",
                    parameters: z.object({
                        files: z.array(
                            z.object({
                                path: z.string().describe("Relative file path"),
                                content: z.string().describe("Complete file content"),
                            })
                        ),
                    }),
                    handler: async ({ files }, { network }) => {
                        const sandbox = await getSandbox(sandboxId);
                        const updated = { ...(network?.state.data.files ?? {}) };

                        for (const file of files) {
                            await sandbox.files.write(file.path, file.content);
                            updated[file.path] = file.content;
                        }

                        if (network) {
                            network.state.data.files = updated;
                        }

                        return "Files updated";
                    },
                }),

                createTool({
                    name: "readFile",
                    description:
                        "Read the contents of existing files when you need to understand or verify code before making changes. Do NOT guess file contents.",
                    parameters: z.object({
                        files: z
                            .array(z.string())
                            .describe("List of relative file paths to read"),
                    }),
                    handler: async ({ files }) => {
                        const sandbox = await getSandbox(sandboxId);
                        return Promise.all(
                            files.map(async (path) => ({
                                path,
                                content: await sandbox.files.read(path),
                            }))
                        );
                    },
                }),
            ],
            lifecycle: {
                onResponse: ({ result, network }) => {
                    if (!network) return result;

                    const txt = lastAssistantTextMessageContent(result);
                    if (txt?.includes("<task_summary>")) {
                        network.state.data.summary = txt;
                    }
                    return result;
                },
            },
        });

        /* -------------------- ITER ESTIMATOR -------------------- */

        const iterEstimator = createAgent({
            name: "iteration-estimator",
            system: "Return ONLY a number between 10 and 60.",
            model: openRouterLLM({ max_tokens: 256, temperature: 0.1 }),
        });

        let maxIter = 60;
        try {
            const { output } = await withTimeout(
                iterEstimator.run(event.data.value)
            );
            const n = parseInt(extractTextFromMessages(output) || "", 10);
            if (!isNaN(n)) maxIter = Math.min(Math.max(n, 10), 60);
        } catch (err) {
            console.error("Error parsing iteration count from estimator:", err);
        }

        if (!event.data.isPro && maxIter > 45) maxIter = 45;

        /* -------------------- NETWORK -------------------- */

        const network = createNetwork({
            name: "coding-network",
            agents: [codeAgent],
            maxIter,
            defaultState: state,
            router: ({ network }) =>
                network.state.data.summary ? undefined : codeAgent,
        });

        if (!event.data.value.trim()) {
            throw new Error("Empty prompt");
        }

        const result = await network.run(event.data.value, { state });

        /* -------------------- RESPONSE -------------------- */

        const titleAgent = createAgent({
            name: "title",
            system: FRAGMENT_TITLE_PROMPT,
            model: openRouterLLM({ max_tokens: 64 }),
        });

        const responseAgent = createAgent({
            name: "response",
            system: RESPONSE_PROMPT,
            model: openRouterLLM({ max_tokens: 512 }),
        });

        const { output: title } = await titleAgent.run(result.state.data.summary);
        const { output: response } = await responseAgent.run(
            result.state.data.summary
        );

        const sandbox = await getSandbox(sandboxId);
        const sandboxUrl = `https://${sandbox.getHost(3000)}`;

        await prisma.message.create({
            data: {
                projectId: event.data.projectId,
                role: "ASSISTANT",
                type: "RESULT",
                content: extractTextFromMessages(response) || "",
                fragment: {
                    create: {
                        sandboxId,
                        sandboxUrl,
                        title: extractTextFromMessages(title) || "Fragment",
                        files: result.state.data.files,
                    },
                },
            },
        });

        return {
            url: sandboxUrl,
            files: result.state.data.files,
            summary: result.state.data.summary,
        };
    }
);
