import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { canInUniverse } from "~/utils/accesscontrol";
import { toSlug } from "~/lib/utils";
import { Prisma } from "@prisma/client";

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

      const baseSlug = toSlug(input.name);
      const MAX = 25;

      for (let i = 0; i < MAX; i++) {
        const candidate = i === 0 ? baseSlug : `${baseSlug}-${i + 1}`;
        try {
          return await db.baseAttribute.create({
            data: {
              Universe: { connect: { id: input.universeId } },
              name: input.name,
              description: input.description,
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
