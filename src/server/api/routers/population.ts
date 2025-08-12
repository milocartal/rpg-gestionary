import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { canInUniverse } from "~/utils/accesscontrol";
import { toSlug } from "~/lib/utils";
import { Prisma } from "@prisma/client";

const populationSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  description: z.string(),
  averageAge: z.number(),
  averageHeight: z.number(),
  averageWeight: z.number(),
  bonus: z.string().optional(),
  universeId: z.string(),
});

export const populationRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const population = await db.population.findUnique({
        where: { id: input.id },
        include: {
          Universe: true,
        },
      });
      if (!population) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Population not found",
        });
      }
      return population;
    }),

  getAll: publicProcedure
    .input(z.object({ universeId: z.string() }))
    .query(async ({ input }) => {
      const populations = await db.population.findMany({
        where: { Universe: { id: input.universeId } },
        include: {
          Universe: true,
        },
      });

      return populations;
    }),

  create: protectedProcedure
    .input(populationSchema)
    .mutation(async ({ ctx, input }) => {
      if (!canInUniverse(ctx.session).createAny("population").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to create a population",
        });
      }

      const baseSlug = toSlug(input.name);
      const MAX = 25;

      for (let i = 0; i < MAX; i++) {
        const candidate = i === 0 ? baseSlug : `${baseSlug}-${i + 1}`;
        try {
          return await db.population.create({
            data: {
              name: input.name,
              image: input.image,
              description: input.description,
              averageAge: input.averageAge,
              averageHeight: input.averageHeight,
              averageWeight: input.averageWeight,
              Universe: {
                connect: {
                  id: input.universeId,
                },
              },
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
              "Une erreur est survenue lors de la création de la population.",
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
      populationSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!canInUniverse(ctx.session).updateAny("population").granted) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to update this population",
        });
      }

      const population = await db.population.update({
        where: { id: input.id },
        data: {
          name: input.name,
          image: input.image,
          description: input.description,
          averageAge: input.averageAge,
          averageHeight: input.averageHeight,
          averageWeight: input.averageWeight,
        },
      });
      return population;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!canInUniverse(ctx.session).deleteAny("population").granted) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to delete this population",
        });
      }

      const population = await db.population.delete({
        where: { id: input.id },
      });
      return population;
    }),
});
