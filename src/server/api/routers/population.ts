import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { canInUniverse } from "~/utils/accesscontrol";

const populationSchema = z.object({
  name: z.string(),
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
          code: "UNAUTHORIZED",
          message: "You are not allowed to create this population",
        });
      }

      const population = await db.population.create({
        data: {
          name: input.name,
          description: input.description,
          averageAge: input.averageAge,
          averageHeight: input.averageHeight,
          averageWeight: input.averageWeight,
          Universe: {
            connect: {
              id: input.universeId,
            },
          },
        },
      });
      return population;
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
