import { getUsageStatus } from "@/lib/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { auth } from "@clerk/nextjs/server";

const FREE_LIMIT = 3;

export const usageRouter = createTRPCRouter({
    status: protectedProcedure.query(async () => {
        const { has } = await auth();
        const isPro = has({ plan: "pro" });

        // Pro users = unlimited
        if (isPro) {
            return {
                used: 0,
                limit: -1,
                remaining: -1,
                isPro: true,
                allowed: true,
            };
        }

        const usage = await getUsageStatus();

        const used = usage?.consumedPoints ?? 0;
        const limit = FREE_LIMIT;

        return {
            used,
            limit,
            remaining: Math.max(0, limit - used),
            isPro: false,
        };
    }),
});
