import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter"
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        console.log(event.data)

        const sandboxId = await step.run("get-sandbox-id", async () => {
            const sandbox = await Sandbox.create("aura-test-project");
            return sandbox.sandboxId;
        });

        const codeAgent = createAgent({
            name: "code-agent",
            system: "You are an expert next js devloper.  You write readable and efficient code. and Maintain high standards for code quality. And also code maintainable code and you wirte next.js & react code snippets.",
            model: gemini({ model: "gemini-2.0-flash" }),
        });

        const { output } = await codeAgent.run(`Write the following snippet : ${event.data.value}`,)

        console.log("Summary:", output);

        const sandboxUrl = await step.run("get-sandbox-url", async () => {
            const sandbox = await getSandbox(sandboxId);
            const host = sandbox.getHost(3000);
            return `https://${host}`;
        });

        return { output, sandboxUrl };
    },
);


/*

CRON ID : 8654321-564e3w2-74632-54321          -> id
CRON NAME : SEND BILLING EMAIL                 -> event
CRON COMMAND : sendEMail("s@ss.d")             -> async..............

*/