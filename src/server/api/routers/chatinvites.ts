import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const chatinvitesRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        chatID: z.number(),
        receiverGoogleId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const currentUser = ctx.currentUser;

      const invite = await ctx.db.chatInvitation.create({
        data: {
          senderGoogleId: currentUser,
          receiverGoogleId: input.receiverGoogleId,
          chatId: input.chatID,
          status: "PENDING",
        },
      });

      return invite;
    }),
});
