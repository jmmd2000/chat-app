import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { chatinvitesRouter } from "./routers/chatinvites";
import { chatRouter } from "./routers/chat";
import { messageRouter } from "./routers/messages";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  chatinvite: chatinvitesRouter,
  chat: chatRouter,
  message: messageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
