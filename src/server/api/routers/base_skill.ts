import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { canInUnivers } from "~/utils/accesscontrol";

const baseSkillSchema = z.object({
  name: z.string(),
  description: z.string(),
  universId: z.string(),
});

export const baseSkillRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const baseSkill = await db.baseSkill.findUnique({
        where: { id: input.id },
        include: {
          Univers: true,
        },
      });
      if (!baseSkill) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Base skill not found",
        });
      }
      return baseSkill;
    }),

  getAll: publicProcedure
    .input(z.object({ universId: z.string() }))
    .query(async ({ input }) => {
      const baseSkills = await db.baseSkill.findMany({
        where: { Univers: { id: input.universId } },
        include: {
          Univers: true,
        },
      });

      return baseSkills;
    }),
  create: protectedProcedure
    .input(baseSkillSchema)
    .mutation(async ({ ctx, input }) => {
      if (!canInUnivers(ctx.session).createAny("base-skill").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to create a base skill",
        });
      }

      const baseSkills = await db.baseSkill.create({
        data: {
          name: input.name,
          description: input.description,
          Univers: { connect: { id: input.universId } },
        },
      });
      return baseSkills;
    }),

  update: protectedProcedure
    .input(
      baseSkillSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!canInUnivers(ctx.session).updateAny("base-skill").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to update a base skill",
        });
      }

      const baseSkill = await db.baseSkill.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
        },
      });
      return baseSkill;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!canInUnivers(ctx.session).deleteAny("base-skill").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to delete a base skill",
        });
      }

      const baseSkill = await db.baseSkill.delete({
        where: { id: input.id },
      });
      return baseSkill;
    }),
});
