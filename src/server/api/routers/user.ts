import { TRPCError } from "@trpc/server";
import { argon2id, hash } from "argon2";

import { sendMail } from "~/lib/mailer";

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

import { can, canInUniverse } from "~/utils/accesscontrol";

import { getPresignedUrl } from "~/utils/minio";
import { issueToken } from "~/server/auth/password-token";
import { createUserSchema } from "~/lib/models/User";

export const userRouter = createTRPCRouter({
  //Permet de recuperer l'utilisateur actuel
  getActual: protectedProcedure.query(async ({ ctx }) => {
    const temp = await db.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
    });

    if (temp.image) {
      const user = { ...temp, image: await getPresignedUrl(temp.image) };
      return user;
    } else return temp;
  }),

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

      const user = await db.user
        .create({
          data: {
            name: input.name,
            email: input.email,
            password: hashed,
            image: input.image,
          },
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user",
          });
        });
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      const emailDetail = {
        to: input.email,
        subject: "Bienvenue sur RPG Gestionary !",
        text: `Bonjour ${input.name},\n\nBienvenue sur RPG Gestionary !\n\nNous sommes ravis de vous accueillir. N'hésitez pas à explorer les fonctionnalités de la plateforme.\n\nCordialement,\nL'équipe RPG Gestionary`,
        html: `<p>Bonjour ${input.name},</p><p>Bienvenue sur RPG Gestionary !</p><p>Nous sommes ravis de vous accueillir. N'hésitez pas à explorer les fonctionnalités de la plateforme.</p><p>Cordialement,<br />L'équipe RPG Gestionary</p>`,
      };

      await sendMail(emailDetail);

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

  invite: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.string(),
        name: z.string(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!can(ctx.session).createAny("user").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unsufficient privileges",
          cause: "User cannot do this action based his current role",
        });
      }

      const temp = await db.user.findUnique({
        where: { email: input.email },
      });
      if (temp) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const user = await db.user
        .create({
          data: {
            email: input.email,
            role: input.role,
            name: input.name,
            image: input.image,
          },
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user",
          });
        });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      const token = await issueToken(user.id, "INVITE");

      if (!token) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create invitation token",
        });
      }

      const emailDetail = {
        to: input.email,
        subject: "Invitation à rejoindre RPG Gestionary",
        text: `Bonjour ${input.name},\n\nVous avez été invité à rejoindre RPG Gestionary. Veuillez cliquer sur le lien suivant pour définir votre mot de passe et activer votre compte : ${token.url}\n\nCordialement,\nL'équipe RPG Gestionary`,
        html: `<p>Bonjour ${input.name},</p><p>Vous avez été invité à rejoindre RPG Gestionary. Veuillez cliquer sur le lien suivant pour définir votre mot de passe et activer votre compte :</p><p><a href="${token.url}">${token.url}</a></p><p>Cordialement,<br />L'équipe RPG Gestionary</p>`,
      };

      await sendMail(emailDetail);

      return user;
    }),

  verify: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!canInUniverse(ctx.session).createAny("invite").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unsufficient privileges",
          cause: "User cannot do this action based his current role",
        });
      }

      const user = await db.user.findUnique({
        where: { email: input.email },
      });
      if (!user) {
        return { success: false, user: null };
      } else return { success: true, user };
    }),

  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  verifyOwnOrigin: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { accounts: true },
    });
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const isOAuthUser = user.accounts.length > 0 && !user.password;

    const origins = user.accounts.map((acc) => acc.provider);
    if (user.password) origins.push("credentials");
    return { isOAuthUser, origins };
  }),

  verifyOrigin: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!can(ctx.session).readAny("user").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unsufficient privileges",
          cause: "User cannot do this action based his current role",
        });
      }
      const user = await db.user.findUnique({
        where: { id: input.id },
        include: { accounts: true },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const isOAuthUser = user.accounts.length > 0 && !user.password;

      const origins = user.accounts.map((acc) => acc.provider);
      if (user.password) origins.push("credentials");
      return { isOAuthUser, origins };
    }),
});
