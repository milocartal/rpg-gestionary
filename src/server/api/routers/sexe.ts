import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const sexeRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const sexe = await db.sexe.findUnique({
        where: { id: input.id },
        include: {
          Univers: true,
        },
      });
      if (!sexe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sexe not found",
        });
      }
      return sexe;
    }),

  getAll: publicProcedure
    .input(z.object({ universId: z.string() }))
    .query(async ({ input }) => {
      const sexes = await db.sexe.findMany({
        where: { Univers: { id: input.universId } },
        include: {
          Univers: true,
        },
      });

      return sexes;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        universId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const sexe = await db.sexe.create({
        data: {
          name: input.name,
          Univers: { connect: { id: input.universId } },
        },
      });
      return sexe;
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
      const sexe = await db.sexe.update({
        where: { id: input.id },
        data: {
          name: input.name,
          Univers: { connect: { id: input.universId } },
        },
      });
      return sexe;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const sexe = await db.sexe.delete({
        where: { id: input.id },
      });
      return sexe;
    }),
});
