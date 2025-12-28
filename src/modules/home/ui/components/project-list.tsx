"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

import { trpc } from "@/trpc/react"; // ✅ CORRECT
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export const ProjectsList = () => {
    const { user } = useUser();

    // 🛑 If not logged in, don't fetch
    const { data: projects = [], isLoading } =
        trpc.projects.getMany.useQuery(undefined, {
            enabled: !!user,
        });

    if (!user) return null;

    return (
        <div className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 lg:mt-16">
            <h2 className="text-2xl font-semibold">
                {user.firstName ? `${user.firstName}'s` : "Your"} projects in Aurix
            </h2>

            {isLoading && (
                <p className="text-sm text-muted-foreground">
                    Loading your projects…
                </p>
            )}

            {!isLoading && projects.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                    You haven’t created any projects in Aurix yet.
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Button
                        key={project.id}
                        variant="outline"
                        className="h-auto justify-start p-4 text-left"
                        asChild
                    >
                        <Link href={`/projects/${project.id}`}>
                            <div className="flex items-center gap-4">
                                <Image
                                    src="/logo.png"
                                    alt="Aurix"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />

                                <div className="flex flex-col overflow-hidden">
                                    <h3 className="truncate font-medium">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(project.updatedAt),
                                            { addSuffix: true }
                                        )}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </Button>
                ))}
            </div>
        </div>
    );
};
