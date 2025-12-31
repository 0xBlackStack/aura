"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { Crown, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export const NavBar = () => {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { has } = useAuth();

    // Only show upgrade if not on /pricing and not pro
    const showUpgrade = pathname !== "/pricing" && !has?.({ plan: "pro" });

    useEffect(() => {
        setMounted(true);
    }, []);

    const isMobile = useIsMobile()

    return (
        <nav className={
            "p-4 fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparet bg-background/25 border-border"
        }>
            <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
                <Link
                    href="/"
                    className="flex items-center gap-2 cursor-target"
                >
                    <Image
                        src="/logo.png"
                        alt="Aurix"
                        width={40}
                        height={40}
                    />
                    <span className="font-semibold text-lg">
                        Aurix
                    </span>
                </Link>

                <div className="flex gap-2">
                    {mounted && (
                        <Toggle
                            aria-label="Dark mode toggle"
                            size="sm"
                            variant="outline"
                            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:stroke-blue-500"
                            pressed={theme === "dark"}
                            onPressedChange={(pressed) =>
                                setTheme(pressed ? "dark" : "light")
                            }
                        >
                            {
                                theme === "light" ? <Moon /> : <Sun />
                            }
                        </Toggle>
                    )}

                    <SignedOut>
                        <div className="flex gap-2 cursor-target">
                            <SignUpButton>
                                <Button size={"sm"} variant="outline" className="cursor-target">
                                    Sign Up
                                </Button>
                            </SignUpButton>
                            <SignInButton>
                                <Button size={"sm"} className="cursor-target">
                                    Sign In
                                </Button>
                            </SignInButton>
                        </div>
                    </SignedOut>

                    <SignedIn>
                        <Link href="/referrals">
                            <Button variant="ghost" size="sm" className="cursor-target">
                                Referrals
                            </Button>
                        </Link>

                        {showUpgrade && (
                            <Button variant="outline" size={isMobile ? "icon-sm" : "sm"} className="cursor-target" onClick={() => { router.push('/pricing') }}>
                                <Crown className="mr-1 h-4 w-4" />
                                <span className={cn(isMobile && "hidden")}>Upgrade</span>
                            </Button>
                        )}

                        <div className="cursor-target">
                            <UserControl showName />
                        </div>
                    </SignedIn>

                </div>
            </div>
        </nav>
    )
}
