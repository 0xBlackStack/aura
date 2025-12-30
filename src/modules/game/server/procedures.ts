import { prisma } from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const gameRouter = createTRPCRouter({
    getScore: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .query(async ({ input, ctx }) => {
            const project = await prisma.project.findUnique({
                where: {
                    id: input.projectId,
                    userId: ctx.auth.userId
                },
                select: { gameScore: true }
            });

            return project?.gameScore || 0;
        }),

    setScore: protectedProcedure
        .input(z.object({ projectId: z.string(), score: z.number().min(0) }))
        .mutation(async ({ input, ctx }) => {
            const project = await prisma.project.findUnique({
                where: {
                    id: input.projectId,
                    userId: ctx.auth.userId
                }
            });

            if (!project) {
                throw new Error("Project not found");
            }

            await prisma.project.update({
                where: { id: input.projectId },
                data: { gameScore: input.score }
            });

            return true;
        }),

    resetScore: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const project = await prisma.project.findUnique({
                where: {
                    id: input.projectId,
                    userId: ctx.auth.userId
                }
            });

            if (!project) {
                throw new Error("Project not found");
            }

            await prisma.project.update({
                where: { id: input.projectId },
                data: { gameScore: 0 }
            });

            return true;
        }),
});
