import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { can, canInUniverse, UniversRolesEnum } from "~/utils/accesscontrol";

export const universeRouter = createTRPCRouter({
  getAllFromSession: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      return [];
    }

    const universes = await db.universe.findMany({
      where: {
        Users: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      include: {
        Users: true,
      },
    });

    return universes;
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        banner: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!can(ctx.session).createOwn("univers").granted) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to create this univers",
        });
      }
      const univers = await db.universe.create({
        data: {
          name: input.name,
          banner: input.banner,
          description: input.description,
          createdById: ctx.session.user.id,
        },
      });

      await db.userToUniverse.create({
        data: {
          userId: ctx.session.user.id,
          universeId: univers.id,
          role: UniversRolesEnum.MANAGER,
        },
      });
      return univers;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        banner: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        !canInUniverse(ctx.session).updateOwn("univers").granted ||
        !can(ctx.session).updateAny("univers").granted
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to update this univers",
        });
      }

      const univers = await db.universe.update({
        where: { id: input.id },
        data: {
          banner: input.banner,
          name: input.name,
          description: input.description,
        },
      });
      return univers;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (
        !canInUniverse(ctx.session).deleteOwn("univers").granted ||
        !can(ctx.session).deleteAny("univers").granted
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to delete this univers",
        });
      }

      const univers = await db.universe.delete({
        where: { id: input.id },
      });
      return univers;
    }),
});
