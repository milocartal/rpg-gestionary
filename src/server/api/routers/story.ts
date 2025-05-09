import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { can, canInUnivers } from "~/utils/accesscontrol";

export const storyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        universId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        !canInUnivers(ctx.session).createOwn("story").granted ||
        !can(ctx.session).createAny("story").granted
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to create this story",
        });
      }

      const story = await db.story.create({
        data: {
          name: input.name,
          description: input.description,
          universId: input.universId,
        },
      });

      return story;
    }),

  update: protectedProcedure
    .input(
      z.object({ id: z.string(), name: z.string(), description: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        !canInUnivers(ctx.session).updateOwn("story").granted ||
        !can(ctx.session).updateAny("story").granted
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to update this story",
        });
      }

      const story = await db.story.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
        },
      });
      return story;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (
        !canInUnivers(ctx.session).deleteOwn("story").granted ||
        !can(ctx.session).deleteAny("story").granted
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to delete this story",
        });
      }

      const story = await db.story.delete({
        where: { id: input.id },
      });
      return story;
    }),
});
