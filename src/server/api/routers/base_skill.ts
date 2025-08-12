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

const baseSkillSchema = z.object({
  name: z.string(),
  description: z.string(),
  universeId: z.string(),
  attributeId: z.string(),
});

export const baseSkillRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const baseSkill = await db.baseSkill.findUnique({
        where: { id: input.id },
        include: {
          Universe: true,
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
    .input(z.object({ universeId: z.string() }))
    .query(async ({ input }) => {
      const baseSkills = await db.baseSkill.findMany({
        where: { Universe: { id: input.universeId } },
        include: {
          Universe: true,
        },
      });

      return baseSkills;
    }),

  create: protectedProcedure
    .input(baseSkillSchema)
    .mutation(async ({ ctx, input }) => {
      if (!canInUniverse(ctx.session).createAny("base-skill").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to create a base skill",
        });
      }

      const baseSlug = toSlug(input.name);
      const MAX = 25;

      for (let i = 0; i < MAX; i++) {
        const candidate = i === 0 ? baseSlug : `${baseSlug}-${i + 1}`;
        try {
          return await db.baseSkill.create({
            data: {
              Universe: { connect: { id: input.universeId } },
              name: input.name,
              description: input.description,
              BaseAttribute: { connect: { id: input.attributeId } },
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
              "Une erreur est survenue lors de la création de la compétence de base.",
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
      baseSkillSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!canInUniverse(ctx.session).updateAny("base-skill").granted) {
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
      if (!canInUniverse(ctx.session).deleteAny("base-skill").granted) {
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
