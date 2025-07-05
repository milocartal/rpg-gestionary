import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { canInUnivers } from "~/utils/accesscontrol";

export const genderRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const gender = await db.gender.findUnique({
        where: { id: input.id },
        include: {
          Univers: true,
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
    .input(z.object({ universId: z.string() }))
    .query(async ({ input }) => {
      const genders = await db.gender.findMany({
        where: { Univers: { id: input.universId } },
        include: {
          Univers: true,
        },
      });

      return genders;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        universId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!canInUnivers(ctx.session).createAny("gender").granted) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to create this gender",
        });
      }

      const gender = await db.gender.create({
        data: {
          name: input.name,
          Univers: { connect: { id: input.universId } },
        },
      });
      return gender;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        universId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!canInUnivers(ctx.session).updateAny("gender").granted) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to update this gender",
        });
      }

      const gender = await db.gender.update({
        where: { id: input.id },
        data: {
          name: input.name,
          Univers: { connect: { id: input.universId } },
        },
      });
      return gender;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!canInUnivers(ctx.session).deleteAny("gender").granted) {
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
