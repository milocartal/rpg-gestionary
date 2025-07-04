import { TRPCError } from "@trpc/server";
import { argon2id, hash } from "argon2";

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

import { can } from "~/utils/accesscontrol";

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const userRouter = createTRPCRouter({
  //Permet de creer un utilisateur simple
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      const temp = await db.user.findUnique({
        where: { email: input.email },
      });
      if (temp) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const hashed = await hash(input.password, {
        type: argon2id,
      });

      const user = await db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashed,
        },
      });

      return user;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!can(ctx.session).updateAny("user").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unsufficient privileges",
          cause: "User cannot do this action based his current role",
        });
      }

      const temp = await db.user.findUnique({
        where: { id: input.id },
      });

      if (!temp) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "user not found",
        });
      }

      return await db.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          image: input.image,
        },
      });
    }),

  //Permet de supprimer un utilisateur
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!can(ctx.session).deleteOwn("user").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unsufficient privileges",
          cause: "User cannot do this action based his current role",
        });
      }
      const temp = await db.user.findUnique({
        where: { id: input.id },
      });

      if (!temp) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "user not found",
        });
      }

      return await db.user.delete({ where: { id: input.id } });
    }),

  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
});
