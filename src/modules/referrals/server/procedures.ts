import { prisma } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { nanoid } from "nanoid";

const REFERRER_POINTS = 20;
const REFEREE_POINTS = 30;
const REFERRAL_DURATION_HOURS = 24;

export const referralsRouter = createTRPCRouter({
    // Get user's referral info
    getReferralInfo: protectedProcedure.query(async () => {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            throw new Error("Not authenticated");
        }

        try {
            let user = await prisma.user.findUnique({
                where: { clerkId },
                include: {
                    referredUsers: {
                        select: {
                            id: true,
                            createdAt: true,
                            points: true,
                        },
                    },
                },
            });

            // If user doesn't exist, create one with referral code
            if (!user) {
                const referralCode = nanoid(8);
                user = await prisma.user.create({
                    data: {
                        clerkId,
                        referralCode,
                    },
                    include: {
                        referredUsers: {
                            select: {
                                id: true,
                                createdAt: true,
                                points: true,
                            },
                        },
                    },
                });
            }

            // If user exists but has no referral code, generate one
            if (!user.referralCode) {
                const referralCode = nanoid(8);
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { referralCode },
                    include: {
                        referredUsers: {
                            select: {
                                id: true,
                                createdAt: true,
                                points: true,
                            },
                        },
                    },
                });
            }

            // Check if points have expired
            const activePoints = user.pointsExpireAt && user.pointsExpireAt < new Date() ? 0 : user.points;

            return {
                referralCode: user.referralCode,
                totalReferrals: user.referredUsers.length,
                points: activePoints,
                referredUsers: user.referredUsers,
            };
        } catch (error) {
            // If database error, return fallback data
            console.error("Error fetching referral info:", error);
            const fallbackReferralCode = nanoid(8);
            return {
                referralCode: fallbackReferralCode,
                totalReferrals: 0,
                points: 0,
                referredUsers: [],
            };
        }
    }),

    // Use referral code during signup
    useReferralCode: protectedProcedure
        .input(z.object({ referralCode: z.string() }))
        .mutation(async ({ input }) => {
            const { userId: clerkId } = await auth();

            if (!clerkId) {
                throw new Error("Not authenticated");
            }

            // Find referrer by code
            const referrer = await prisma.user.findUnique({
                where: { referralCode: input.referralCode },
            });

            if (!referrer) {
                throw new Error("Invalid referral code");
            }

            if (referrer.clerkId === clerkId) {
                throw new Error("Cannot use your own referral code");
            }

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { clerkId },
            });

            if (existingUser) {
                throw new Error("User already has a referral code or has been referred");
            }

            // Create new user with referral
            const referralCode = nanoid(8);
            const pointsExpireAt = new Date(Date.now() + REFERRAL_DURATION_HOURS * 60 * 60 * 1000);
            await prisma.user.create({
                data: {
                    clerkId,
                    referralCode,
                    referredBy: referrer.id,
                    points: REFEREE_POINTS,
                    pointsExpireAt,
                },
            });

            // Award points to referrer
            await prisma.user.update({
                where: { id: referrer.id },
                data: {
                    points: { increment: REFERRER_POINTS },
                },
            });

            return {
                success: true,
                pointsEarned: REFEREE_POINTS,
                referrerPoints: REFERRER_POINTS,
            };
        }),

    // Get referral stats
    getStats: protectedProcedure.query(async () => {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            throw new Error("Not authenticated");
        }

        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: {
                referredUsers: {
                    where: {
                        createdAt: {
                            gte: new Date(Date.now() - REFERRAL_DURATION_HOURS * 60 * 60 * 1000),
                        },
                    },
                },
            },
        });

        if (!user) {
            return {
                totalReferrals: 0,
                recentReferrals: 0,
                totalPoints: 0,
            };
        }

        // Check if points have expired
        const activePoints = user.pointsExpireAt && user.pointsExpireAt < new Date() ? 0 : user.points;

        return {
            totalReferrals: user.referredUsers.length,
            recentReferrals: user.referredUsers.filter(
                (ref) => ref.createdAt >= new Date(Date.now() - REFERRAL_DURATION_HOURS * 60 * 60 * 1000)
            ).length,
            totalPoints: activePoints,
        };
    }),
});
