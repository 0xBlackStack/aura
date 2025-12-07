import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState, useMemo, useCallback, Fragment } from "react";

import { Hint } from "@/app/projects/ui/components/hints";
import { Button } from "@/components/ui/button";

import { CodeView } from "./code-view";
import {
    ResizablePanel,
    ResizablePanelGroup,
    ResizableHandle,
} from "@/components/ui/resizable";
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "./tree-view";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";

type FileCollection = {
    [path: string]: string;
};

function getLanguageFromFilePath(filePath: string): string {
    const extension = filePath.split(".").pop()?.toLowerCase();
    return extension || "text";
}

const FileBreadcrumbProps = ({ filePath }: { filePath: string }) => {
    const parts = filePath.split("/");
    const maxSegments = 4;

    const renderBreadcrumbsItems = () => {
        if (parts.length <= maxSegments) {

            return parts.map((segment, index) => {
                const isLast = index === parts.length - 1;

                return (
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            {isLast ? (
                                <BreadcrumbPage className="font-medium">
                                    {segment}
                                </BreadcrumbPage>
                            ) : (
                                <span className="text-muted-foreground">
                                    {segment}
                                </span>
                            )}
                        </BreadcrumbItem>

                        {!isLast && <BreadcrumbSeparator />}
                    </Fragment>
                )
            })
        } else {
            const firstSegment = parts[0];
            const lastSegments = parts[parts.length - 1];

            return (
                <>
                    <BreadcrumbItem>
                        <span className="text-muted-foreground">
                            {firstSegment}
                        </span>

                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbEllipsis />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium">
                                {lastSegments}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbItem>
                </>
            )
        }
    };

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {renderBreadcrumbsItems()}
            </BreadcrumbList>
        </Breadcrumb>
    )
};

export const FileExplorer = ({ files }: { files: FileCollection }) => {
    const [selectedFilePath, setSelectedFilePath] = useState<string | null>(() => {
        const filePaths = Object.keys(files);
        return filePaths.length > 0 ? filePaths[0] : null;
    });

    const treeData = useMemo(() => {
        return convertFilesToTreeItems(files);
    }, [files]);

    const handleFileSelect = useCallback((
        filePath: string
    ) => {
        if (files[filePath]) {
            setSelectedFilePath(filePath);
        }
    }, [files])

    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        if (selectedFilePath) {
            navigator.clipboard.writeText(files[selectedFilePath]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [selectedFilePath, files]);

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
                <TreeView
                    data={treeData}
                    value={selectedFilePath}
                    onSelect={handleFileSelect}
                />
            </ResizablePanel>

            <ResizableHandle className="hover:bg-primary transition-colors" />

            <ResizablePanel defaultSize={70} minSize={50}>
                {
                    selectedFilePath && files[selectedFilePath] ? (
                        <div className="h-full w-full flex flex-col">
                            <div className="border-b bg-sidebar px-4 py-2 flex items-center justify-between gap-x-2">
                                <FileBreadcrumbProps filePath={selectedFilePath} />
                                <Hint text={"Copy to clipboard"} side="bottom">
                                    <Button
                                        variant={"outline"}
                                        size={"icon"}
                                        onClick={handleCopy}
                                        className="ml-auto"
                                        disabled={copied}
                                    >
                                        {
                                            copied ? <CopyCheckIcon /> :
                                                <CopyIcon className="h-4 w-4" />
                                        }
                                    </Button>
                                </Hint>
                            </div>

                            <div className="flex-1 overflow-auto">
                                <CodeView
                                    code={files[selectedFilePath]}
                                    lang={getLanguageFromFilePath(selectedFilePath)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            Select a file to view it&apos;s contents.
                        </div>
                    )
                }
            </ResizablePanel>
        </ResizablePanelGroup>
    )
};