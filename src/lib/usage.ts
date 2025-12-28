import { RateLimiterPrisma } from 'rate-limiter-flexible';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

const FREE_POINTS = 20;
const PRO_POINTS = 100;
const DURATION = 60 * 60 * 24; // 24 hours in seconds
const GENRATION_COST = 1; // Each generation costs 1 point

export async function getUsageTracker() {
    const { has } = await auth();
    const hasPremiumAccess = has({ plan: 'pro' });

    const usageTracker = new RateLimiterPrisma({
        storeClient: prisma,
        tableName: "Usage",
        points: hasPremiumAccess ? PRO_POINTS : FREE_POINTS,
        duration: DURATION,
    })

    return usageTracker;
}

export async function consumeCredit() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const usageTracker = await getUsageTracker();
    const result = await usageTracker.consume(userId, GENRATION_COST);

    return result;
}

export async function getUsageStatus() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const usageTracker = await getUsageTracker();
    const result = await usageTracker.get(userId);

    return result;
}

const FREE_LIMIT = 3;


export async function canUsePromptEnhancer() {
    const { userId, has } = await auth();
    if (!userId) throw new Error("Not authenticated");
    const isPro = has && has({ plan: "pro" });
    if (isPro) {
        return { allowed: true, remaining: -1, isPro: true };
    }
    const usage = await prisma.promptUsage.findUnique({ where: { userId } });
    const used = usage?.count ?? 0;
    return {
        allowed: used < FREE_LIMIT,
        remaining: Math.max(0, FREE_LIMIT - used),
        isPro: false,
    };
}

export async function consumePromptEnhancer() {
    const { userId, has } = await auth();
    if (!userId) throw new Error("Not authenticated");
    const isPro = has && has({ plan: "pro" });
    if (isPro) return;
    await prisma.promptUsage.upsert({
        where: { userId },
        update: { count: { increment: 1 } },
        create: { userId, count: 1 },
    });
}
