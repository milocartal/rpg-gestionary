import { z } from "zod";

import {
  createTRPCRouter,
  //protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const skillRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
