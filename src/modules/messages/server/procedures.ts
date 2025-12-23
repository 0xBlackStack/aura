import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { consumeCredit } from "@/lib/usage";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const messagesRouter = createTRPCRouter({
    getMany: protectedProcedure
        .input(
            z.object({
                projectId: z.string().min(1, { message: "Project ID cannot be empty" }),
            })
        )
        .query(async ({ input, ctx }) => {
            const messages = await prisma.message.findMany({
                where: {
                    project: {
                        userId: ctx.auth.userId,
                    },
                    projectId: input.projectId,
                },
                orderBy: {
                    updatedAt: "asc",
                },
                include: {
                    fragment: true,
                }
            })

            return messages;
        }),

    create: protectedProcedure
        .input(
            z.object({
                value: z.string().min(1, { message: "Message cannot be empty" }).max(10000, { message: "Message is too long" }),
                projectId: z.string().min(1, { message: "Project ID cannot be empty" }),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const exisitingProject = await prisma.project.findUnique({
                where: {
                    id: input.projectId,
                    userId: ctx.auth.userId,
                },
            })

            if (!exisitingProject) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found",
                });
            }

            try {
                await consumeCredit();
            } catch (error) {
                if (
                    error instanceof Error
                ) {
                    console.error("Error consuming credit:", error.message);
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Something went wrong",
                    });
                } else {
                    throw new TRPCError({
                        code: "TOO_MANY_REQUESTS",
                        message: "You have run out of credits",
                    });
                }
            }

            const createdMessage = await prisma.message.create({
                data: {
                    projectId: exisitingProject.id,
                    content: input.value,
                    role: "USER",
                    type: "RESULT"
                }
            });

            await inngest.send({
                name: "code-agent/run",
                data: { value: input.value, projectId: input.projectId },
            })

            return createdMessage;
        })
});