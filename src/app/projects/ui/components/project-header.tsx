"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    SunMoonIcon,
} from "lucide-react";

import { trpc } from "@/trpc/react"; // ✅ ONLY THIS
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ProjectHeader = ({ projectId }: { projectId: string }) => {
    const { setTheme, theme } = useTheme();

    // ✅ PROPER CLIENT SUSPENSE QUERY
    const [project] = trpc.projects.getOne.useSuspenseQuery({
        id: projectId,
    });

    return (
        <header className="p-2 flex justify-between items-center border-b">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!"
                    >
                        <Image src="/logo.png" alt="Aurix" width={18} height={18} />
                        <span className="text-sm font-medium">{project.name}</span>
                        <ChevronDownIcon />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="bottom" align="start">
                    <DropdownMenuItem asChild>
                        <Link href="/">
                            <ChevronLeftIcon />
                            <span>Go to Dashboard</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="gap-2">
                            <SunMoonIcon className="size-4 text-muted-foreground" />
                            <span>Appearance</span>
                        </DropdownMenuSubTrigger>

                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup
                                    value={theme}
                                    onValueChange={setTheme}
                                >
                                    <DropdownMenuRadioItem value="light">
                                        Light
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark">
                                        Dark
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="system">
                                        System
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
};
