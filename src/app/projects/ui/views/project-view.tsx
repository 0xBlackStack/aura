"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MessageContainer } from "../components/message-container";
import { Suspense } from "react";

export const ProjectView = ({ projectId }: { projectId: string }) => {
    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={20} minSize={20} className="flex flex-col min-h-0">
                    <Suspense fallback={<p>Loading messages...</p>}>
                        <MessageContainer projectId={projectId} />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75} minSize={50}>
                    TODO : Preview
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}