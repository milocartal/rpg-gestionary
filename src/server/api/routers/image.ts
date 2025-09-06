import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getPresignedUrl } from "~/utils/minio";

export const imageRouter = createTRPCRouter({
  getPresigned: publicProcedure
    .input(z.object({ url: z.string() }))
    .mutation(({ input }) => {
      return getPresignedUrl(input.url);
    }),
});
