import Link from "next/link";
import { CrownIcon } from "lucide-react";
import { formatDuration, intervalToDuration } from "date-fns";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

interface Props {
    points: number;
    msBeforeNextPoint: number;
}

export const Usage = ({ points, msBeforeNextPoint }: Props) => {
    const { has } = useAuth();
    const hasPremiumAccess = has?.({ plan: 'pro' });

    return (
        <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
            <div className="flex items-center gap-x-2">
                <div>
                    <p className="text-sm">
                        {points} {hasPremiumAccess ? "" : "free"} credits available
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Resets in{" "}
                        {
                            formatDuration(
                                intervalToDuration({
                                    start: new Date(),
                                    end: new Date(Date.now() + msBeforeNextPoint),
                                }),
                                {
                                    format: ["days", "hours", "minutes", "seconds"],
                                }
                            )
                        }
                    </p>
                </div>
                {
                    !hasPremiumAccess && (
                        <Button asChild size={"sm"} variant={"tertiary"} className="ml-auto">
                            <Link href={"/pricing"}>
                                <CrownIcon /> Upgrade
                            </Link>
                        </Button>
                    )
                }
            </div>
        </div>
    )
};