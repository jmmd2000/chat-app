import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { Chat } from "~/types";

export const chatRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const currentUser = ctx.currentUser;

      const chat = await ctx.db.chat.create({
        data: {
          type: "DIRECT",
          participants: {
            connect: [{ google_id: currentUser }, { google_id: input }],
          },
        },
      });

      return chat;
    }),
  fetchChatByUser: privateProcedure.query(async ({ ctx }) => {
    const currentUser = ctx.currentUser;

    const chats = await ctx.db.chat.findMany({
      where: {
        type: "DIRECT" || "GROUP",
        participants: {
          some: {
            google_id: currentUser,
          },
        },
      },
      include: {
        participants: true,
        messages: true,
      },
    });

    return chats as unknown as Chat[];
  }),
  fetchChatById: privateProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      console.log(input);

      const chat = await ctx.db.chat.findUnique({
        where: {
          id: input,
        },
        include: {
          participants: true,
          messages: true,
        },
      });

      return chat as unknown as Chat;
    }),
});
