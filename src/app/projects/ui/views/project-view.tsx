"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MessageContainer } from "../components/message-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma/client";
import { ProjectHeader } from "../components/project-header";
import { FragmentView } from "../components/fragment-web";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, DownloadIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileExplorer } from "@/components/file-explorer";

export const ProjectView = ({ projectId }: { projectId: string }) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
    const [tabState, setTabState] = useState<"preview" | "code">("preview");

    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">

                {/* LEFT PANEL */}
                <ResizablePanel defaultSize={20} minSize={20} className="flex flex-col min-h-0">
                    <Suspense fallback={<p>Loading Project...</p>}>
                        <ProjectHeader projectId={projectId} />
                    </Suspense>

                    <Suspense fallback={<p>Loading messages...</p>}>
                        <MessageContainer
                            projectId={projectId}
                            activeFragment={activeFragment}
                            setActiveFragment={setActiveFragment}
                        />
                    </Suspense>
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
                                <Button asChild size={"sm"} variant="outline">
                                    <Link href="/download">
                                        <DownloadIcon size={16} /> Download
                                    </Link>
                                </Button>
                                <p>
                                    |
                                </p>
                                <Button asChild size="sm" variant="default">
                                    <Link href="/pricing">
                                        <CrownIcon size={16} /> Upgrade
                                    </Link>
                                </Button>
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

                    </Tabs>
                </ResizablePanel>

            </ResizablePanelGroup>
        </div>
    );
};
