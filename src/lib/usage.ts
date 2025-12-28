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

/**
 * Retrieve the current rate-limiter usage record for the authenticated user.
 *
 * @returns The user's rate-limiter usage record for the current window, or `null` if no record exists.
 * @throws Error - If there is no authenticated user (`"User not authenticated"`).
 */
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

/**
 * Determines whether the current user may use the prompt enhancer and how many free uses remain.
 *
 * @returns An object with `allowed` set to `true` if the user may use the enhancer and `remaining` equal to the number of free uses left (uses `Infinity` for pro users).
 * @throws If there is no authenticated user.
 */
export async function canUsePromptEnhancer() {
    const { userId, has } = await auth();

    if (!userId) throw new Error("Not authenticated");

    // Pro = unlimited
    if (has({ plan: "pro" })) {
        return { allowed: true, remaining: Infinity };
    }

    const usage = await prisma.promptUsage.findUnique({
        where: { userId },
    });

    const used = usage?.count ?? 0;

    console.log(
        used < FREE_LIMIT,
        Math.max(0, FREE_LIMIT - used),
    )

    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")

    return {
        allowed: used < FREE_LIMIT,
        remaining: Math.max(0, FREE_LIMIT - used),
    };
}

/**
 * Increment the prompt-enhancer usage count for the authenticated user.
 *
 * For pro-plan users this function does nothing; for non-pro users it records one additional use
 * by incrementing (or creating) the user's prompt usage count in persistent storage.
 *
 * @throws Error - If the caller is not authenticated (message: "Not authenticated")
 */
export async function consumePromptEnhancer() {
    const { userId, has } = await auth();
    if (!userId) throw new Error("Not authenticated");

    // Pro users don't get tracked
    if (has({ plan: "pro" })) return;

    await prisma.promptUsage.upsert({
        where: { userId },
        update: { count: { increment: 1 } },
        create: { userId, count: 1 },
    });
}