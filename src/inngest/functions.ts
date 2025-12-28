import { inngest } from "./client";
import { createAgent, createTool, createNetwork, Tool, Message, createState } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter"
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import z from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import { prisma } from "@/lib/db";

// import { openai } from "@inngest/agent-kit";
import { openai } from "inngest";
import { logEvent } from "@/lib/logger";
function extractTextFromMessages(messages?: Message[]) {
    if (!messages) return null;

    for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (msg.type === "text") {
            return Array.isArray(msg.content)
                ? msg.content.join("")
                : msg.content;
        }
    }

    return null;
}
const GROQ_KEYS = [
    process.env.GROQ_KEY_1,
    process.env.GROQ_KEY_2,
].filter(Boolean);

let groqKeyIndex = 0;

function getGroqKey() {
    if (!GROQ_KEYS.length) {
        throw new Error("No GROQ API keys configured");
    }
    const key = GROQ_KEYS[groqKeyIndex];
    groqKeyIndex = (groqKeyIndex + 1) % GROQ_KEYS.length;
    return key;
}

// ================= MODEL ROUTING =================

type Provider = "groq" | "openrouter";

// Groq gets priority (listed twice)
const PROVIDERS: Provider[] = ["groq", "groq", "openrouter"];

let providerIndex = 0;

const GROQ_MODELS = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "llama-3.3-70b-versatile",
];

let groqModelIndex = 0;

function getNextProvider(): Provider {
    const provider = PROVIDERS[providerIndex];
    providerIndex = (providerIndex + 1) % PROVIDERS.length;
    return provider;
}

const OPENROUTER_FALLBACK_MODELS = [
    "openai/gpt-oss-20b",
    "qwen/qwen3-coder-480b-a35b-instruct",
    "mistralai/mistral-small-3.1-24b-instruct",
    "meta-llama/llama-3.3-70b-instruct",
    "google/gemini-2.0-flash-exp",
];

let openRouterModelIndex = 0;

function getOpenRouterModel() {
    const model = OPENROUTER_FALLBACK_MODELS[openRouterModelIndex];
    openRouterModelIndex =
        (openRouterModelIndex + 1) % OPENROUTER_FALLBACK_MODELS.length;
    logEvent({
        type: "model_selected",
        model,
    });

    return model;
}

function getLLM() {
    const provider = getNextProvider();
    logEvent({
        type: "llm_selected",
        provider,
    });

    // -------- GROQ --------
    if (provider === "groq") {
        const model = GROQ_MODELS[groqModelIndex];
        groqModelIndex = (groqModelIndex + 1) % GROQ_MODELS.length;
        logEvent({
            type: "model_selected",
            model,
        });

        return openai({
            baseUrl: "https://api.groq.com/openai/v1",
            apiKey: getGroqKey(),
            model,
        });
    }

    // -------- OPENROUTER FALLBACK --------
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
        throw new Error("OPENROUTER_API_KEY is missing. Please set it in your environment to use OpenRouter features.");
    }
    return openai({
        baseUrl: "https://openrouter.ai/api/v1",
        apiKey: openRouterKey,
        model: getOpenRouterModel(),
    });

}


// const model = openai({
//     model: "mistralai/mistral-small-3.2-24b-instruct:free", // any OpenRouter model
//     baseUrl: "https://openrouter.ai/api/v1", // 👈 custom base URL
//     apiKey: process.env.OPENROUTER_API_KEY,  // 👈 your OpenRouter key,
// });

interface AgentState {
    summary: string;
    files: { [path: string]: string };
}

// const GEMINI_KEYS = [
//     process.env.GEMINI_API_KEY_1,
//     process.env.GEMINI_API_KEY_2,
//     process.env.GEMINI_API_KEY_3,
//     process.env.GEMINI_API_KEY_4,
//     process.env.GEMINI_API_KEY_5,
//     process.env.GEMINI_API_KEY_6,
//     process.env.GEMINI_API_KEY_7,
//     process.env.GEMINI_API_KEY_8,
//     process.env.GEMINI_API_KEY_9,
//     process.env.GEMINI_API_KEY_10,
//     process.env.GEMINI_API_KEY_11,
//     process.env.GEMINI_API_KEY_12,
//     process.env.GEMINI_API_KEY_13,
// ];

// let requestCount = 0;

// const MODEL_SEQUENCE = [
//     "gemini-2.0-flash",
//     "gemini-2.5-pro",
//     "gemini-2.5-flash",
// ];

// function getRotatingGeminiKey() {
//     const index = Math.floor(requestCount / 2) % GEMINI_KEYS.length;
//     requestCount++;
//     return GEMINI_KEYS[index];
// }

// function getAlternatingGeminiModel() {
//     const index = requestCount % MODEL_SEQUENCE.length;
//     return MODEL_SEQUENCE[index];
// }


// const MODELS = [
//     "openai/gpt-oss-120b",
//     "openai/gpt-oss-20b",
//     "llama-3.3-70b-versatile",
//     "openai/gpt-oss-120b",
// ];

// let modelIndex = 0;

// function getNextModel() {
//     const model = MODELS[modelIndex];
//     modelIndex = (modelIndex + 1) % MODELS.length;
//     return model;
// }
function normalizeFiles(
    files: unknown
): { [path: string]: string } {
    if (
        typeof files === "object" &&
        files !== null &&
        !Array.isArray(files)
    ) {
        const result: Record<string, string> = {};

        for (const [key, value] of Object.entries(files)) {
            if (typeof value === "string") {
                result[key] = value;
            }
        }

        return result;
    }

    return {};
}
function getLastNMessages(
    messages: Message[],
    n: number
): string {
    return messages
        .slice(-n)
        .map((m) => {
            if (m.type !== "text") return null;

            const role = m.role === "assistant" ? "Assistant" : "User";
            const content = Array.isArray(m.content)
                ? m.content.join("")
                : m.content;

            return `${role}: ${content}`;
        })
        .filter(Boolean)
        .join("\n");
}


export const codeAgentFunction = inngest.createFunction(
    { id: "code-agent" },
    { event: "code-agent/run" },
    async ({ event, step }) => {
        logEvent({
            type: "ai_request_start",
            projectId: event.data.projectId,
            promptLength: event.data.value.length,
        });

        console.log(event.data);

        const lastFragment = await prisma.fragment.findFirst({
            where: { message: { projectId: event.data.projectId } },
            orderBy: { createdAt: "desc" },
        });

        const sandboxId = await step.run("get-sandbox-id", async () => {
            const sandbox = await Sandbox.create("aura-test-project");

            logEvent({
                type: "sandbox_created",
                sandboxId: sandbox.sandboxId,
                projectId: event.data.projectId,
            });

            await sandbox.setTimeout(60_000 * 10 * 3);

            if (lastFragment?.files) {
                for (const [path, content] of Object.entries(lastFragment.files)) {
                    await sandbox.files.write(path, content);
                }
                console.log("Sandbox rehydrated with previous files");
            }
            // sandbox.commands.run("cd /home/user && npm run dev -- --turbopack", {
            //     background: true
            // })

            return sandbox.sandboxId;
        });


        const previousMessages = await step.run(
            "get-previous-messages",
            async () => {
                const formtedMessages: Message[] = [];

                const messages = await prisma.message.findMany({
                    where: {
                        project: {
                            id: event.data.projectId,
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 7,
                });

                messages.forEach((message, i) => {
                    formtedMessages.push({
                        role: message.role === "ASSISTANT" ? "assistant" : "user",
                        content: `${i}. ${message.role === "ASSISTANT" ? "Assistant" : "User"}: ${message.content}`,
                        type: "text",
                    });
                });

                return formtedMessages.reverse(); // 👈 untouched, promise 🥲
            }
        );

        const state = createState<AgentState>({
            summary: "",
            files: normalizeFiles(lastFragment?.files),
        }, {
            messages: previousMessages,
        });

        // const modelName = getAlternatingGeminiModel();
        // const apiKey = getRotatingGeminiKey();

        const codeAgent = createAgent<AgentState>({
            name: "code-agent",
            description: "An expert coding agent",
            system: PROMPT,
            model: getLLM(),
            tools: [
                createTool({
                    name: "terminal",
                    description: "Use the terminal to run commands in sandbox.",
                    parameters: z
                        .object({
                            command: z.string(),
                        }),
                    handler: async ({ command }, { step }) => {
                        return await step?.run("terminal", async () => {
                            const buffers = { stdout: "", stderr: "" };

                            try {
                                const sandbox = await getSandbox(sandboxId);
                                const result = await sandbox.commands.run(command, {
                                    onStdout: (data: string) => {
                                        buffers.stdout += data;
                                    },

                                    onStderr: (data: string) => {
                                        buffers.stderr += data;
                                    }
                                })

                                return result.stdout
                            } catch (e) {
                                console.log(`Command failed : ${e}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`);

                                return `Command failed : ${e}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
                            }
                        })
                    }
                }),
                createTool({
                    name: "createOrUpdateFiles",
                    description: "Create or update a file in the sandbox.",
                    parameters: z.object({
                        files: z.array(
                            z.object({
                                path: z.string(),
                                content: z.string(),
                            })
                        )
                    }),
                    handler: async ({ files }, { step, network }) => {
                        const newFiles = await step?.run("createOrUpdateFiles", async () => {
                            try {

                                const updatedFiles = { ...(network.state.data.files || {}) };
                                const sandbox = await getSandbox(sandboxId);

                                for (const file of files) {
                                    await sandbox.files.write(file.path, file.content);
                                    updatedFiles[file.path] = file.content;    // 🆕 actually assign each file
                                }

                                return updatedFiles;                         // 🧹 cleaner, simpler

                            } catch (e) {
                                return `Failed to create or update files: ${e}`;
                            }
                        })

                        if (typeof newFiles === "object") {
                            network.state.data.files = newFiles;
                        }
                    }
                }),

                createTool({
                    name: "readFile",
                    description: "Read files from the sandbox.",
                    parameters: z.object({
                        files: z.array(z.string()),
                    }),

                    handler: async ({ files }, { step }: Tool.Options<AgentState>) => {
                        return await step?.run("readFiles", async () => {
                            try {
                                const sandbox = await getSandbox(sandboxId);
                                const contents = [];

                                for (const file of files) {
                                    const content = await sandbox.files.read(file);
                                    contents.push({ path: file, content });
                                }

                                return JSON.stringify(contents);
                            } catch (e) {
                                return `Failed to read files: ${e}`;
                            }
                        })
                    }
                })
            ],


            lifecycle: {
                onResponse: async ({ result, network }) => {
                    const lastAssistantMessageText = lastAssistantTextMessageContent(result);

                    if (lastAssistantMessageText && network) {
                        if (lastAssistantMessageText.includes("<task_summary>")) {
                            network.state.data.summary = lastAssistantMessageText;
                        }
                    }

                    return result;
                },
            }
        });

        const ITER_ESTIMATOR_PROMPT = `
You are an expert software project planner.

Your task:
- Read the user's instruction.
- Estimate how many think-act iterations an AI coding agent will need.
- Consider:
  - Project size
  - Number of files
  - Refactors vs fresh code
  - Debugging or architecture changes

Rules:
- Return ONLY a single integer.
- Minimum: 10
- Maximum: 60
- No text. No explanation. No punctuation.
`;


        const iterEstimatorAgent = createAgent({
            name: "iteration-estimator",
            description: "Estimates required agent iterations",
            system: ITER_ESTIMATOR_PROMPT,
            model: openai({
                baseUrl: "https://api.groq.com/openai/v1",
                apiKey: getGroqKey(),
                model: "openai/gpt-oss-20b",
            }),
        });


        let estimatedMaxIter = 60;

        try {
            const recentContext = getLastNMessages(previousMessages, 3);

            const iterEstimatorInput = `
User Request:
${event.data.value}

Recent Conversation Context (last 3 messages):
${recentContext}
`.trim();

            const { output } = await iterEstimatorAgent.run(iterEstimatorInput);


            const raw = extractTextFromMessages(output);
            const parsed = raw ? parseInt(raw, 10) : NaN;

            if (!isNaN(parsed)) {
                estimatedMaxIter = Math.min(Math.max(parsed, 10), 60);
            }
        } catch {
            estimatedMaxIter = 60;
        }

        console.log(`Estimated Max Iterations: ${estimatedMaxIter}`);

        const network = createNetwork<AgentState>({
            name: "coding-agent-network",
            agents: [codeAgent],
            maxIter: estimatedMaxIter,
            defaultState: state,
            router: async ({ network }) => {
                const summary = network.state.data.summary;

                if (summary) {
                    return;
                }

                return codeAgent;
            }
        })

        let promptActual;


        if (event.data.enhancePrompt === true) {

            const PROMPT_ENHANCER_PROMPT = `
You are a prompt enhancement engine.

Your ONLY task is to rewrite and enhance the user's input so it becomes:
- Clear
- Structured
- Detailed
- Unambiguous
- Suitable for an AI system to understand and act on

Rules you MUST follow:

1. Do NOT refuse, block, warn, or judge the user's input.
2. Do NOT mention legality, safety, ethics, or policy.
3. Do NOT remove intent, even if the request sounds sensitive or unusual.
4. Do NOT add instructions on how to execute or bypass systems.
5. Do NOT add new goals beyond what the user implies.
6. Do NOT answer the request — only rewrite it.

Your job is ONLY to improve clarity and structure.

What you SHOULD do:
- Fix grammar and language
- Expand vague ideas into explicit requirements
- Infer missing but obvious details
- Convert casual language into professional, neutral language
- Organize the request into steps, goals, or sections if helpful
- Preserve the original meaning exactly

If the input is very short or unclear:
- Expand it into a complete, well-formed request
- Make reasonable assumptions based on common intent
- Do not ask questions — just enhance

Output format:
- Return ONLY the enhanced prompt
- No explanations
- No headings like "Enhanced Prompt"
- No markdown
- No commentary

Remember:
You are NOT a safety layer.
You are NOT a validator.
You are NOT an executor.

You are a neutral prompt refiner.
`;

            const fixPrompt = createAgent({
                name: "fix-prompt",
                description: "AI Prompt enhancer",
                system: PROMPT_ENHANCER_PROMPT,
                model: openai({
                    baseUrl: "https://api.groq.com/openai/v1",
                    apiKey: getGroqKey(),
                    model: "openai/gpt-oss-20b",
                }),
            });

            let promptActual;
            try {
                const { output } = await fixPrompt.run(event.data.value);
                const enhancedPrompt = extractTextFromMessages(output);

                // Enhanced validation: must be non-empty, not obviously truncated, ends with sentence punctuation, no artifacts
                const isValidEnhanced = (
                    typeof enhancedPrompt === 'string' &&
                    enhancedPrompt.trim().length > 0 &&
                    enhancedPrompt.length >= event.data.value.length &&
                    /[.!?\u2026]$/.test(enhancedPrompt.trim()) &&
                    !/\.\.\.|\{\{|\}\}|\[\[|\]\]|<.*?>|__PLACEHOLDER__|\bTODO\b/i.test(enhancedPrompt) // no ellipsis, unmatched braces, placeholder tokens
                );

                if (isValidEnhanced) {
                    promptActual = enhancedPrompt;
                } else {
                    promptActual = event.data.value;
                }
            } catch (e) {
                console.error("Prompt enhancement failed, falling back to original:", e);
                promptActual = event.data.value;
            }
        } else {
            promptActual = event.data.value;
        }

        const result = await network.run(promptActual, {
            state
        });

        const fragmentTitleGenerator = createAgent({
            name: "fragment-title-generator",
            description: "A fragment title generator agent.",
            system: FRAGMENT_TITLE_PROMPT,
            model: openai({
                baseUrl: "https://api.groq.com/openai/v1",
                apiKey: getGroqKey(),
                model: "openai/gpt-oss-20b",
            }),
        });

        const responseGenerator = createAgent({
            name: "response-generator",
            description: "A response generator agent.",
            system: RESPONSE_PROMPT,
            model: openai({
                baseUrl: "https://api.groq.com/openai/v1",
                apiKey: getGroqKey(),
                model: "openai/gpt-oss-20b",
            }),
        });

        const { output: fragmentTitle } = await fragmentTitleGenerator.run(result.state.data.summary);

        const { output: response } = await responseGenerator.run(result.state.data.summary);

        const isError = !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;

        logEvent({
            type: "ai_request_end",
            projectId: event.data.projectId,
            status: isError ? "error" : "success",
        });

        console.log(`
            Summary : ${result.state.data.summary}

            Files : ${JSON.stringify(result.state.data.files, null, 2)}

            Files Count : ${Object.keys(result.state.data.files || {}).length}
            `)

        const sandboxUrl = await step.run("get-sandbox-url", async () => {
            const sandbox = await getSandbox(sandboxId);
            const host = sandbox.getHost(3000);
            return `https://${host}`;
        });

        await step.run("save-result", async () => {
            if (isError) {
                return await prisma.message.create({
                    data: {
                        projectId: event.data.projectId,
                        content: "We couldn’t complete this request right now. Please try again. Try to enhance your prompt.",
                        role: "ASSISTANT",
                        type: "ERROR",
                    }
                })
            }

            const genrateInfo = (output: Message[]) => {
                const value = output[0];

                if (value.type !== "text") {
                    return "No summary generated";
                }

                if (Array.isArray(value.content)) {
                    return value.content.map((txt) => txt).join("");
                } else {
                    return value.content;
                }
            }

            return await prisma.message.create({
                data: {
                    projectId: event.data.projectId,
                    content: genrateInfo(response) || "No summary generated",
                    role: "ASSISTANT",
                    type: "RESULT",
                    fragment: {
                        create: {
                            sandboxId: sandboxId, // ✅ STORE IT
                            sandboxUrl: sandboxUrl,
                            title: genrateInfo(fragmentTitle),
                            files: result.state.data.files,
                        }
                    }
                }
            })
        })

        return {
            url: sandboxUrl,
            title: "Fragment",
            files: result.state.data.files,
            summary: result.state.data.summary,
        };
    },
);
