import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { canInUniverse } from "~/utils/accesscontrol";

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
          code: "UNAUTHORIZED",
          message: "You are not allowed to create this gender",
        });
      }

      const gender = await db.gender.create({
        data: {
          name: input.name,
          Universe: { connect: { id: input.universeId } },
        },
      });
      return gender;
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
