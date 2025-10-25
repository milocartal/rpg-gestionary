import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { toSlug } from "~/lib/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { canInUniverse } from "~/utils/accesscontrol";

const createClassSchema = z.object({
  name: z.string(),
  description: z.string(),
  universeId: z.string(),
});

export const classRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const classData = await db.class.findUnique({
        where: { id: input.id },
      });
      if (!classData) throw new TRPCError({ code: "NOT_FOUND" });
      return classData;
    }),

  getAll: publicProcedure
    .input(z.object({ universeId: z.string() }))
    .query(async ({ input }) => {
      const classes = await db.class.findMany({
        where: { universeId: input.universeId },
      });
      return classes;
    }),

  create: protectedProcedure
    .input(createClassSchema)
    .mutation(async ({ ctx, input }) => {
      if (!canInUniverse(ctx.session).createAny("class").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to create a class",
        });
      }

      const baseSlug = toSlug(input.name);
      const MAX = 25;

      for (let i = 0; i < MAX; i++) {
        const candidate = i === 0 ? baseSlug : `${baseSlug}-${i + 1}`;
        try {
          return await db.class.create({
            data: {
              Universe: { connect: { id: input.universeId } },
              name: input.name,
              summary: input.description,
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
              "Une erreur est survenue lors de la création de la classe.",
          });
        }
      }

      throw new TRPCError({
        code: "CONFLICT",
        message: "Impossible de générer un slug unique.",
      });
    }),

  update: protectedProcedure
    .input(createClassSchema.extend({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!canInUniverse(ctx.session).updateAny("class").granted) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You do not have permission to update a class in this universe",
        });
      }

      try {
        const updatedClass = await db.class.update({
          where: { id: input.id },
          data: {
            name: input.name,
            summary: input.description,
            universeId: input.universeId,
          },
        });

        return updatedClass;
      } catch (error) {
        console.error("Error updating class:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update class",
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!canInUniverse(ctx.session).deleteAny("class").granted) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You do not have permission to delete a class in this universe",
        });
      }

      try {
        await db.class.delete({
          where: { id: input.id },
        });
      } catch (error) {
        console.error("Error deleting class:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete class",
        });
      }
    }),
});
