"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MessageContainer } from "../components/message-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma/client";
import { ProjectHeader } from "../components/project-header";
import { FragmentView } from "../components/fragment-web";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, DownloadCloud, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileExplorer } from "@/components/file-explorer";
import dynamic from "next/dynamic";

const UserControl = dynamic(
    () => import("@/components/user-control").then(m => m.UserControl),
    { ssr: false }
);

import { useAuth } from "@clerk/nextjs";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import { trpc } from "@/trpc/react";


export const ProjectView = ({ projectId }: { projectId: string }) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
    const [tabState, setTabState] = useState<"preview" | "code">("preview");
    const [] = useState(false)

    const { has } = useAuth()
    const isFreePlan = has?.({ plan: "free_user" })

    const downloadMutation = trpc.projects.getDownloadUrl.useMutation({
        onSuccess: ({ url }) => {
            window.open(url, "_blank");
        },
        onError: (err) => {
            console.error(err)
            toast.error("Download failed");
        },
    });

    const handleDownload = () => {
        if (!activeFragment?.sandboxId) return;

        downloadMutation.mutate({
            sandboxId: activeFragment.sandboxId,
        });
    };


    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">

                {/* LEFT PANEL */}
                <ResizablePanel defaultSize={20} minSize={20} className="flex flex-col min-h-0">
                    <ErrorBoundary
                        fallback={
                            <div className="flex h-full items-center justify-center p-6 animate-fade-in">
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-center">
                                    <p className="text-sm font-medium text-red-400">

                                        Something went wrong. Please try again later.
                                    </p>
                                </div>
                            </div>
                        }
                    >
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center p-4 animate-pulse">
                                    <p className="text-sm text-muted-foreground">
                                        Loading Project…
                                    </p>
                                </div>
                            }
                        >
                            <ProjectHeader projectId={projectId} />
                        </Suspense>
                    </ErrorBoundary>

                    <ErrorBoundary
                        fallback={
                            <div className="flex h-full items-center justify-center p-6 animate-fade-in">
                                <p className="rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground">
                                    Failed to load messages.
                                </p>
                            </div>
                        }
                    >
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center p-6 animate-pulse">
                                    <p className="text-sm text-muted-foreground">
                                        Loading messages…
                                    </p>
                                </div>
                            }
                        >
                            <MessageContainer
                                projectId={projectId}
                                activeFragment={activeFragment}
                                setActiveFragment={setActiveFragment}
                            />
                        </Suspense>
                    </ErrorBoundary>

                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* RIGHT PANEL */}
                <ResizablePanel defaultSize={75} minSize={50} className="flex flex-col">

                    {/* ⬇️ TABS ROOT MUST WRAP EVERYTHING INCLUDING HEADER */}
                    <Tabs
                        value={tabState}
                        onValueChange={(value) => setTabState(value as "preview" | "code")}
                        className="flex flex-col h-full"
                    >

                        {/* HEADER BAR WITHIN TABS */}
                        <div className="w-full flex items-center p-2 border-b gap-x-2">

                            <TabsList className="h-8 p-0 border rounded-md">
                                <TabsTrigger value="preview" className="rounded-md flex items-center gap-1">
                                    <EyeIcon size={16} /> Demo
                                </TabsTrigger>

                                <TabsTrigger value="code" className="rounded-md flex items-center gap-1">
                                    <CodeIcon size={16} /> Code
                                </TabsTrigger>
                            </TabsList>

                            <div className="ml-auto flex items-center gap-x-2">
                                {isFreePlan ? (
                                    <Button asChild size="sm" variant="tertiary">
                                        <Link href="/pricing">
                                            <CrownIcon size={16} className="mr-1 inline-block" />
                                            Upgrade
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="tertiary"
                                        onClick={handleDownload}
                                    >
                                        <DownloadCloud size={16} className="mr-1 inline-block" />
                                        Download
                                    </Button>
                                )}

                                <UserControl />
                            </div>
                        </div>

                        {/* CONTENT AREA */}
                        <TabsContent value="preview" className="flex-1 overflow-auto">
                            {activeFragment ? (
                                <FragmentView data={activeFragment} />
                            ) : (
                                <p className="text-muted-foreground text-center mt-20">
                                    Select a fragment to preview.
                                </p>
                            )}
                        </TabsContent>

                        <TabsContent value="code" className="flex-1 overflow-auto">
                            {!!activeFragment?.files && (
                                <FileExplorer files={activeFragment.files as { [path: string]: string; }} />

                            )}
                        </TabsContent>

                        <p className="text-muted-foreground text-center text-xs">
                            “Aurix assists with code generation and previews. Users are responsible for reviewing, testing, and using all outputs.”
                        </p>

                    </Tabs>
                </ResizablePanel>

            </ResizablePanelGroup>
        </div>
    );
};
