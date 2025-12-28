import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { generateSlug } from "random-word-slugs"
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { canUsePromptEnhancer, consumeCredit, consumePromptEnhancer } from "@/lib/usage";
import { getSandbox } from "@/inngest/utils";

export const projectsRouter = createTRPCRouter({
    getOne: protectedProcedure

        .input(
            z.object({
                id: z.string().min(1, { message: "Project ID cannot be empty" }),
            })
        )
        .query(async ({ input, ctx }) => {
            const exsistingProject = await prisma.project.findUnique({
                where: {
                    id: input.id,
                    userId: ctx.auth.userId,
                }
            })

            if (!exsistingProject) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
            }

            return exsistingProject;
        }),

    getMany: protectedProcedure
        .query(async ({ ctx }) => {
            const projects = await prisma.project.findMany({
                where: {
                    userId: ctx.auth.userId,
                },
                orderBy: {
                    updatedAt: "desc",
                }
            })

            return projects;
        }),

    create: protectedProcedure
        .input(
            z.object({
                value: z.string().min(1).max(10000),
                enhancePrompt: z.boolean(),
            })
        )
        .mutation(async ({ input, ctx }) => {

            // 1️⃣ Check enhance availability (NO consume yet)
            if (input.enhancePrompt) {
                const status = await canUsePromptEnhancer();

                if (!status.allowed) {
                    throw new TRPCError({
                        code: "TOO_MANY_REQUESTS",
                        message: "Free limit reached for Enhance Prompt. Upgrade to Pro.",
                    });
                }
            }

            // 2️⃣ Consume credits (rate limit)
            try {
                await consumeCredit();
            } catch {
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: "You have run out of credits",
                });
            }

            // 3️⃣ Create project
            const createdProject = await prisma.project.create({
                data: {
                    userId: ctx.auth.userId,
                    name: generateSlug(2, { format: "kebab" }),
                    messages: {
                        create: {
                            content: input.value,
                            role: "USER",
                            type: "RESULT",
                        },
                    },
                },
            });

            // 4️⃣ Trigger background job
            await inngest.send({
                name: "code-agent/run",
                data: {
                    value: input.value,
                    projectId: createdProject.id,
                    enhancePrompt: input.enhancePrompt,
                },
            });

            // 5️⃣ NOW consume enhance usage (SAFE)
            if (input.enhancePrompt) {
                await consumePromptEnhancer();
            }

            return createdProject;
        }),

    getDownloadUrl: protectedProcedure
        .input(z.object({ sandboxId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            if (!ctx.auth.has({ plan: "pro" })) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            const sandbox = await getSandbox(input.sandboxId);

            try {
                // 🔍 DEBUG STEP 1: where am I?
                const pwd = await sandbox.commands.run(
                    "pwd && ls -la",
                    { cwd: "/home/user", timeoutMs: 30000 }
                );

                console.log("PWD DEBUG:", pwd.stdout);

                // 🔍 DEBUG STEP 2: check tar
                const whichTar = await sandbox.commands.run(
                    "which tar && tar --version",
                    { cwd: "/home/user", timeoutMs: 30000 }
                );

                console.log("TAR DEBUG:", whichTar.stdout);

                // 🔍 DEBUG STEP 3: create archive WITH TRACE
                await sandbox.commands.run(
                    "tar --ignore-failed-read -czf aurix-project.tar.gz --exclude=node_modules --exclude=.next --exclude=.git --exclude=dist --exclude=.turbo . || true",
                    {
                        cwd: "/home/user",
                        timeoutMs: 120000,
                    }
                );

                const url = await sandbox.downloadUrl("/home/user/aurix-project.tar.gz");
                return { url };

            } catch (e: unknown) {
                console.error("DOWNLOAD FAILED FULL ERROR:", e);

                // 🔥 FORCE ERROR DETAILS TO CLIENT
                let errorMsg = "";
                if (typeof e === "object" && e !== null && "message" in e && typeof (e as { message?: unknown }).message === "string") {
                    errorMsg = (e as { message: string }).message;
                } else {
                    errorMsg = JSON.stringify(e);
                }
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Download failed: ${errorMsg}`,
                });
            }
        })
});