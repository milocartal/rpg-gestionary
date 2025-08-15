import { z } from "zod";
import { sendMail } from "~/lib/mailer";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const mailRouter = createTRPCRouter({
  sendContactEmail: publicProcedure
    .input(
      z.object({
        to: z.string().email(),
        subject: z.string().min(2).max(100),
        text: z.string().min(2).max(1000),
        html: z.string().min(2).max(1000),
      }),
    )
    .mutation(async ({ input }) => {
      await sendMail(input).catch((error) => {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
      });

      return {
        success: true,
      };
    }),

  sendMail: protectedProcedure
    .input(
      z.object({
        to: z.string().email(),
        subject: z.string().min(2).max(100),
        text: z.string().min(2).max(1000),
        html: z.string().min(2).max(1000),
      }),
    )
    .mutation(async ({ input }) => {
      await sendMail(input).catch((error) => {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
      });
      return {
        success: true,
      };
    }),
});
