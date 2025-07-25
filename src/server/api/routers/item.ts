import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ItemTypeZod } from "~/lib/models/Item";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { canInUniverse } from "~/utils/accesscontrol";

const CreateItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  sprite: z.string().optional(),
  weight: z.number().optional(),
  value: z.number().optional(),
  isConsumable: z.boolean().optional().default(false),
  public: z.boolean().optional().default(false),
  type: ItemTypeZod,
  universeId: z.string(),
});

export const itemRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const item = await db.item.findUnique({
        where: { id: input.id },
        include: {
          Universe: true,
        },
      });
      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }
      return item;
    }),

  getAll: publicProcedure
    .input(z.object({ universeId: z.string() }))
    .query(async ({ input }) => {
      const items = await db.item.findMany({
        where: { Universe: { id: input.universeId } },
        include: {
          Universe: true,
        },
      });
      return items;
    }),

  create: protectedProcedure
    .input(CreateItemSchema.strict())
    .mutation(async ({ input, ctx }) => {
      if (!canInUniverse(ctx.session).createOwn("item")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to create items in this universe.",
        });
      }
      const item = await db.item.create({
        data: {
          ...input,
        },
      });
      return item;
    }),

  update: protectedProcedure
    .input(CreateItemSchema.extend({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!canInUniverse(ctx.session).updateOwn("item")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to update items in this universe.",
        });
      }
      const item = await db.item.update({
        where: { id: input.id },
        data: {
          ...input,
        },
      });
      return item;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!canInUniverse(ctx.session).deleteOwn("item")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to delete items in this universe.",
        });
      }
      const item = await db.item.delete({
        where: { id: input.id },
      });
      return item;
    }),
});
