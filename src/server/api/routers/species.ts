import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { canInUniverse } from "~/utils/accesscontrol";

const speciesSchema = z.object({
  name: z.string(),
  description: z.string(),
  averageAge: z.number(),
  maxWeight: z.number(),
  minWeight: z.number(),
  maxHeight: z.number(),
  minHeight: z.number(),
  universeId: z.string(),
});

export const speciesRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const species = await db.species.findUnique({
        where: { id: input.id },
        include: {
          Universe: true,
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
    .input(z.object({ universeId: z.string() }))
    .query(async ({ input }) => {
      const species = await db.species.findMany({
        where: { Universe: { id: input.universeId } },
        include: {
          Universe: true,
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
      if (!canInUniverse(ctx.session).createAny("species").granted) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to create this species",
        });
      }

      const species = await db.species.create({
        data: {
          name: input.name,
          description: input.description,
          averageAge: input.averageAge,
          maxWeight: input.maxWeight,
          minWeight: input.minWeight,
          maxHeight: input.maxHeight,
          minHeight: input.minHeight,
          Universe: {
            connect: {
              id: input.universeId,
            },
          },
        },
      });
      return species;
    }),

  update: protectedProcedure
    .input(speciesSchema.extend({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!canInUniverse(ctx.session).updateAny("species").granted) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to update this species",
        });
      }

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
      if (!canInUniverse(ctx.session).deleteAny("species").granted) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to delete this species",
        });
      }

      const species = await db.species.delete({
        where: { id: input.id },
      });
      return species;
    }),
});
