import { inngest } from "./client";
import { createAgent, createTool, createNetwork, Tool } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter"
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import z from "zod";
import { PROMPT } from "@/prompt";
import { prisma } from "@/lib/db";

// import { openai } from "@inngest/agent-kit";
import { openai } from "inngest";

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


const MODELS = [
    "openai/gpt-oss-120b",
    "llama-3.3-70b-versatile",
    "llama-3.3-70b-versatile",
    "openai/gpt-oss-120b",
];

let modelIndex = 0;

function getNextModel() {
    const model = MODELS[modelIndex];
    modelIndex = (modelIndex + 1) % MODELS.length;
    return model;
}


export const codeAgentFunction = inngest.createFunction(
    { id: "code-agent" },
    { event: "code-agent/run" },
    async ({ event, step }) => {
        console.log(event.data);

        const sandboxId = await step.run("get-sandbox-id", async () => {
            const sandbox = await Sandbox.create("aura-test-project");
            return sandbox.sandboxId;
        });

        // const modelName = getAlternatingGeminiModel();
        // const apiKey = getRotatingGeminiKey();

        const codeAgent = createAgent<AgentState>({
            name: "code-agent",
            description: "An expert coding agent",
            system: PROMPT,
            model: openai({
                baseUrl: "https://api.groq.com/openai/v1",
                apiKey: process.env.GROQ || "",
                model: getNextModel(),
            }),
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

        const network = createNetwork<AgentState>({
            name: "coding-agent-network",
            agents: [codeAgent],
            maxIter: 15,
            router: async ({ network }) => {
                const summary = network.state.data.summary;

                if (summary) {
                    return;
                }

                return codeAgent;
            }
        })

        const result = await network.run(event.data.value);

        const isError = !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;

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
                        content: "Something went wrong while processing the request. Please try again.",
                        role: "ASSISTANT",
                        type: "ERROR",
                    }
                })
            }

            return await prisma.message.create({
                data: {
                    projectId: event.data.projectId,
                    content: result.state.data.summary || "No summary generated",
                    role: "ASSISTANT",
                    type: "RESULT",
                    fragment: {
                        create: {
                            sandboxUrl: sandboxUrl,
                            title: "Fragment",
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
