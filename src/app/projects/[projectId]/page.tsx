import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProjectView } from "../ui/views/project-view";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    params: Promise<{
        projectId: string;
    }>;
}

const Page = async ({ params }: Props) => {
    const { projectId } = await params;

    const queryClient = getQueryClient();

    // prefetch (parallel, non-blocking)
    void queryClient.prefetchQuery(
        trpc.messages.getMany.queryOptions({ projectId })
    );

    void queryClient.prefetchQuery(
        trpc.projects.getOne.queryOptions({ id: projectId })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary
                fallback={
                    <div className="flex h-full min-h-[60vh] items-center justify-center p-6 animate-fade-in">
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
                        <div className="flex h-full min-h-[60vh] items-center justify-center p-6">
                            <p className="animate-pulse text-sm text-muted-foreground">
                                Loading…
                            </p>
                        </div>
                    }
                >
                    <ProjectView projectId={projectId} />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
};

export default Page;
