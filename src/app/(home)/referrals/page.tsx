"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, Gift, Trophy } from "lucide-react";
import { toast } from "sonner";
import Aurora from '@/components/Aurora';
import PixelSnow from '@/components/PixelSnow';
import { useTheme } from "next-themes";

export default function ReferralsPage() {
    const [referralCode, setReferralCode] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isSmall, setIsSmall] = useState(false);

    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const check = () => setIsSmall(window.innerWidth < 640);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const snowColor = "#ffffff";

    const { data: referralInfo, isLoading } = trpc.referrals.getReferralInfo.useQuery();
    const useReferralMutation = trpc.referrals.useReferralCode.useMutation();
    const { data: stats } = trpc.referrals.getStats.useQuery();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const handleUseReferral = async () => {
        if (!referralCode.trim()) {
            toast.error("Please enter a referral code");
            return;
        }

        try {
            await useReferralMutation.mutateAsync({ referralCode: referralCode.trim() });
            toast.success("Referral code applied successfully!");
            setReferralCode("");
        } catch (error) {
            toast.error((error as Error).message || "Failed to apply referral code");
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <div className="h-8 bg-muted rounded w-1/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="border rounded-lg p-6">
                        <div className="h-6 bg-muted rounded w-1/3 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-2/3 mb-4 animate-pulse"></div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-10 bg-muted rounded flex-1 animate-pulse"></div>
                            <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
                        </div>
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    </div>
                    <div className="border rounded-lg p-6">
                        <div className="h-6 bg-muted rounded w-1/2 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-2/3 mb-4 animate-pulse"></div>
                        <div className="flex gap-2 mb-4">
                            <div className="h-10 bg-muted rounded flex-1 animate-pulse"></div>
                            <div className="h-10 w-20 bg-muted rounded animate-pulse"></div>
                        </div>
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    </div>
                    <div className="border rounded-lg p-6 md:col-span-2">
                        <div className="h-6 bg-muted rounded w-1/4 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-1/3 mb-6 animate-pulse"></div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="text-center">
                                <div className="h-8 bg-muted rounded w-12 mx-auto mb-2 animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-16 mx-auto animate-pulse"></div>
                            </div>
                            <div className="text-center">
                                <div className="h-8 bg-muted rounded w-12 mx-auto mb-2 animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-16 mx-auto animate-pulse"></div>
                            </div>
                            <div className="text-center">
                                <div className="h-8 bg-muted rounded w-12 mx-auto mb-2 animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-16 mx-auto animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

            return (
                <>
                    {/* PixelSnow background */}
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 0,
                            pointerEvents: "none",
                        }}
                    >
                        {mounted && resolvedTheme === "light" && isSmall && (
                            <PixelSnow
                                color={snowColor}
                                pixelResolution={500}
                                speed={1.4}
                                density={0.25}
                                flakeSize={0.013}
                                brightness={0.8}
                                depthFade={20}
                                farPlane={20}
                                direction={125}
                                variant="square"
                            />
                        )}
                        {mounted && resolvedTheme === "dark" && !isSmall && (
                            <Aurora
                                colorStops={["#5227FF", "#7cff67", "#5227FF"]}
                                amplitude={1}
                                blend={0.5}
                            />
                        )}
                    </div>

                    <div
                        style={{
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
                                <p className="text-muted-foreground">
                                    Invite friends and earn points! Both you and your friends get rewarded.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Your Referral Code */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Gift className="h-5 w-5" />
                                            Your Referral Code
                                        </CardTitle>
                                        <CardDescription>
                                            Share this code with friends to earn points
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={referralInfo?.referralCode || ""}
                                                readOnly
                                                className="font-mono"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => copyToClipboard(referralInfo?.referralCode || "")}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            When someone uses your code, you get 20 points and they get 30 points!
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Use Referral Code */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Have a Referral Code?
                                        </CardTitle>
                                        <CardDescription>
                                            Enter a referral code to get 30 points
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Enter referral code"
                                                value={referralCode}
                                                onChange={(e) => setReferralCode(e.target.value)}
                                            />
                                            <Button
                                                onClick={handleUseReferral}
                                                disabled={useReferralMutation.isPending}
                                            >
                                                {useReferralMutation.isPending ? "Applying..." : "Apply"}
                                            </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            You can only use a referral code once during signup.
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Stats */}
                                <Card className="md:col-span-2">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Trophy className="h-5 w-5" />
                                            Your Referral Stats
                                        </CardTitle>
                                        <CardDescription>
                                            Track your referral performance
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-primary">
                                                    {stats?.totalReferrals || 0}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Total Referrals
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-primary">
                                                    {stats?.recentReferrals || 0}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Recent (24h)
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-primary">
                                                    {stats?.totalPoints || 0}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Total Points
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Referral History */}
                                {referralInfo?.referredUsers && referralInfo.referredUsers.length > 0 && (
                                    <Card className="md:col-span-2">
                                        <CardHeader>
                                            <CardTitle>Recent Referrals</CardTitle>
                                            <CardDescription>
                                                People who joined using your referral code
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {referralInfo.referredUsers.slice(0, 10).map((user, index) => (
                                                    <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant="secondary">
                                                                #{index + 1}
                                                            </Badge>
                                                            <div>
                                                                <div className="font-medium">User joined</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline">
                                                            +20 points earned
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            );
        }
