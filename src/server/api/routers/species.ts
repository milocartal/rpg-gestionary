import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

const speciesSchema = z.object({
  name: z.string(),
  description: z.string(),
  averageAge: z.number(),
  maxWeight: z.number(),
  minWeight: z.number(),
  maxHeight: z.number(),
  minHeight: z.number(),
  universId: z.string(),
});

export const speciesRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const species = await db.species.findUnique({
        where: { id: input.id },
        include: {
          Univers: true,
        },
      });

      if (!species) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Species not found",
        });
      }
      return species;
    }),

  getAll: publicProcedure
    .input(z.object({ universId: z.string() }))
    .query(async ({ input }) => {
      const species = await db.species.findMany({
        where: { Univers: { id: input.universId } },
        include: {
          Univers: true,
        },
      });
      if (!species) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Species not found",
        });
      }
      return species;
    }),

  create: protectedProcedure
    .input(speciesSchema)
    .mutation(async ({ input, ctx }) => {
      const species = await db.species.create({
        data: {
          name: input.name,
          description: input.description,
          averageAge: input.averageAge,
          maxWeight: input.maxWeight,
          minWeight: input.minWeight,
          maxHeight: input.maxHeight,
          minHeight: input.minHeight,
          Univers: {
            connect: {
              id: input.universId,
            },
          },
        },
      });
      return species;
    }),

  update: protectedProcedure
    .input(speciesSchema.extend({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const species = await db.species.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          averageAge: input.averageAge,
          maxWeight: input.maxWeight,
          minWeight: input.minWeight,
          maxHeight: input.maxHeight,
          minHeight: input.minHeight,
        },
      });
      return species;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const species = await db.species.delete({
        where: { id: input.id },
      });
      return species;
    }),
});
