import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event }) => {
        console.log(event.data)

        const codeAgent = createAgent({
            name: "code-agent",
            system: "You are an expert next js devloper.  You write readable and efficient code. and Maintain high standards for code quality. And also code maintainable code and you wirte next.js & react code snippets.",
            model: gemini({ model: "gemini-2.0-flash" }),
        });

        const { output } = await codeAgent.run(`Write the following snippet : ${event.data.value}`,)

        console.log("Summary:", output);

        return { output };
    },
);


/*

CRON ID : 8654321-564e3w2-74632-54321          -> id
CRON NAME : SEND BILLING EMAIL                 -> event
CRON COMMAND : sendEMail("s@ss.d")             -> async..............

*/