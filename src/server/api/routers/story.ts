import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { toSlug } from "~/lib/utils";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { can, canInUniverse } from "~/utils/accesscontrol";

export const storyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        banner: z.string().optional(),
        description: z.string(),
        universeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!canInUniverse(ctx.session).createAny("story").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to create a story",
        });
      }

      const baseSlug = toSlug(input.name);
      const MAX = 25;

      for (let i = 0; i < MAX; i++) {
        const candidate = i === 0 ? baseSlug : `${baseSlug}-${i + 1}`;
        try {
          return await db.story.create({
            data: {
              name: input.name,
              banner: input.banner,
              description: input.description,
              universeId: input.universeId,
              createdById: ctx.session.user.id,
              slug: candidate,
            },
          });
        } catch (e) {
          if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === "P2002"
          ) {
            continue; // slug déjà pris -> on essaie le suivant
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Une erreur est survenue lors de la création de l'attribut de base.",
          });
        }
      }

      throw new TRPCError({
        code: "CONFLICT",
        message: "Impossible de générer un slug unique.",
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        banner: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        !canInUniverse(ctx.session).updateOwn("story").granted ||
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
          banner: input.banner,
        },
      });
      return story;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (
        !canInUniverse(ctx.session).deleteOwn("story").granted ||
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
