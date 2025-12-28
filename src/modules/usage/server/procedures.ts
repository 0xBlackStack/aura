import { prisma } from "@/lib/db";
import { getUsageStatus } from "@/lib/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { auth } from "@clerk/nextjs/server";

export const usageRouter = createTRPCRouter({
    status: protectedProcedure.query(async () => {
        try {
            const result = await getUsageStatus();
            return result;
        } catch (error) {
            console.error("Error fetching usage status:", error);
            return null;
        }
    }),
    statusForPE: protectedProcedure.query(async () => {
        const { userId, has } = await auth(); // 👈 YAHI MISSING THA

        if (!userId) {
            throw new Error("Not authenticated");
        }

        if (has({ plan: "pro" })) {
            return {
                isPro: true,
            };
        }

        const usage = await prisma.promptUsage.findUnique({
            where: { userId }, // ✅ ab defined
        });

        const used = usage?.count ?? 0;

        return {
            isPro: false,
            used,
            limit: 3,
            remaining: Math.max(0, 3 - used),
            allowed: used < 3,
        };
    })
})