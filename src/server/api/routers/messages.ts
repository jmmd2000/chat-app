import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { type Message } from "~/types";

export const messageRouter = createTRPCRouter({
  sendMessage: privateProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const currentUser = ctx.currentUser;

      const message = await ctx.db.message.create({
        data: {
          senderGoogleId: currentUser,
          text: input,
          chat_id: 1,
        },
      });

      return message;
    }),
  fetchMessages: privateProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      // const currentUser = ctx.currentUser;

      const messages = await ctx.db.message.findMany({
        where: {
          chat_id: input,
        },
        include: {
          user: true,
          chat: true,
          readReceipts: true,
        },
      });

      return messages as unknown as Message[];
    }),
  fetchMessageById: privateProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      // const currentUser = ctx.currentUser;

      const message = await ctx.db.message.findUnique({
        where: {
          id: input,
        },
        include: {
          user: true,
          chat: true,
          readReceipts: true,
        },
      });

      return message as unknown as Message;
    }),
});
