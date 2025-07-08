import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { canInUniverse } from "~/utils/accesscontrol";

const baseAttributeSchema = z.object({
  name: z.string(),
  description: z.string(),
  universeId: z.string(),
});

export const baseAttributeRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const baseAttribute = await db.baseAttribute.findUnique({
        where: { id: input.id },
        include: {
          Universe: true,
        },
      });
      if (!baseAttribute) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Base attribute not found",
        });
      }
      return baseAttribute;
    }),

  getAll: publicProcedure
    .input(z.object({ universeId: z.string() }))
    .query(async ({ input }) => {
      const baseAttributes = await db.baseAttribute.findMany({
        where: { Universe: { id: input.universeId } },
        include: {
          Universe: true,
        },
      });

      return baseAttributes;
    }),
  create: protectedProcedure
    .input(baseAttributeSchema)
    .mutation(async ({ ctx, input }) => {
      if (!canInUniverse(ctx.session).createAny("base-attribute").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to create a base attribute",
        });
      }

      const baseAttributes = await db.baseAttribute.create({
        data: {
          name: input.name,
          description: input.description,
          Universe: { connect: { id: input.universeId } },
        },
      });
      return baseAttributes;
    }),

  update: protectedProcedure
    .input(
      baseAttributeSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!canInUniverse(ctx.session).updateAny("base-attribute").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to update a base attribute",
        });
      }

      const baseAttribute = await db.baseAttribute.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
        },
      });
      return baseAttribute;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!canInUniverse(ctx.session).deleteAny("base-attribute").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to delete a base attribute",
        });
      }

      const baseAttribute = await db.baseAttribute.delete({
        where: { id: input.id },
      });
      return baseAttribute;
    }),
});
