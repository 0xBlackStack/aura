import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Client } from "./client";
import { Suspense } from "react";

export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.createAI.queryOptions({
      text: "Client Side Query"
    })
  )


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback="Loading...">
        <Client />
      </Suspense>
    </HydrationBoundary>
  );
}
