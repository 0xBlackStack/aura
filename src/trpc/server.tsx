import 'server-only';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';

import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';

// Stable per-request query client
export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
    ctx: createTRPCContext,
    router: appRouter,
    queryClient: getQueryClient,
});

// Server-side direct caller (no React)

// Use this to get a caller with the correct context
export async function getCaller() {
    const context = await createTRPCContext();
    return appRouter.createCaller(context);
}
