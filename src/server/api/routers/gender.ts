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

export const genderRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const gender = await db.gender.findUnique({
        where: { id: input.id },
        include: {
          Universe: true,
        },
      });
      if (!gender) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Gender not found",
        });
      }
      return gender;
    }),

  getAll: publicProcedure
    .input(z.object({ universeId: z.string() }))
    .query(async ({ input }) => {
      const genders = await db.gender.findMany({
        where: { Universe: { id: input.universeId } },
        include: {
          Universe: true,
        },
      });

      return genders;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        universeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!canInUniverse(ctx.session).createAny("gender").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to create a gender",
        });
      }

      const baseSlug = toSlug(input.name);
      const MAX = 25;

      for (let i = 0; i < MAX; i++) {
        const candidate = i === 0 ? baseSlug : `${baseSlug}-${i + 1}`;
        try {
          return await db.gender.create({
            data: {
              Universe: { connect: { id: input.universeId } },
              name: input.name,

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
            message: "Une erreur est survenue lors de la création du genre.",
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
        universeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!canInUniverse(ctx.session).updateAny("gender").granted) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to update this gender",
        });
      }

      const gender = await db.gender.update({
        where: { id: input.id },
        data: {
          name: input.name,
          Universe: { connect: { id: input.universeId } },
        },
      });
      return gender;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!canInUniverse(ctx.session).deleteAny("gender").granted) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to delete this gender",
        });
      }

      const gender = await db.gender.delete({
        where: { id: input.id },
      });
      return gender;
    }),
});
