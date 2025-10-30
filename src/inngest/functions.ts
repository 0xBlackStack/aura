import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("download-video", "30s");
        await step.sleep("transcript", "15s");
        await step.sleep("summary", "5s");
        return { message: `Hello ${event.data.email}!` };
    },
);


/*

CRON ID : 8654321-564e3w2-74632-54321          -> id
CRON NAME : SEND BILLING EMAIL                 -> event
CRON COMMAND : sendEMail("s@ss.d")             -> async..............

*/