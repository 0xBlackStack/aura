import { messagesRouter } from '@/modules/messages/server/procedures';
import { createTRPCRouter } from '../init';
import { projectsRouter } from '@/modules/projects/server/procedures';
import { usageRouter } from '@/modules/usage/server/procedures';
import { referralsRouter } from '@/modules/referrals/server/procedures';
export const appRouter = createTRPCRouter({
    messages: messagesRouter,
    usage: usageRouter,
    projects: projectsRouter,
    referrals: referralsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
