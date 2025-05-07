import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { can, canInUnivers, UniversRolesEnum } from "~/utils/accesscontrol";

export const universRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!can(ctx.session).createOwn("univers")) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to create this univers",
        });
      }
      const univers = await db.univers.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });

      await db.userToUnivers.create({
        data: {
          userId: ctx.session.user.id,
          universId: univers.id,
          role: UniversRolesEnum.MANAGER,
        },
      });
      return univers;
    }),

  update: protectedProcedure
    .input(
      z.object({ id: z.string(), name: z.string(), description: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        !canInUnivers(ctx.session).updateOwn("univers") ||
        !can(ctx.session).updateAny("univers")
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to update this univers",
        });
      }

      const univers = await db.univers.update({
        where: { id: input.id },
        data: {
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
        !canInUnivers(ctx.session).deleteOwn("univers") ||
        !can(ctx.session).deleteAny("univers")
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to delete this univers",
        });
      }

      const univers = await db.univers.delete({
        where: { id: input.id },
      });
      return univers;
    }),
});
