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

import { can } from "~/utils/accesscontrol";
import { env } from "~/env";

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

      const user = await db.user
        .create({
          data: {
            name: input.name,
            email: input.email,
            password: hashed,
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

      console.log(`User created: ${user.name} (${user.email})`);

      const emailDetail = {
        to: input.email,
        subject: "Bienvenue sur RPG Gestionary !",
        text: `Bonjour ${input.name},\n\nBienvenue sur RPG Gestionary !\n\nNous sommes ravis de vous accueillir. N'hésitez pas à explorer les fonctionnalités de la plateforme.\n\nCordialement,\nL'équipe RPG Gestionary`,
        html: `<p>Bonjour ${input.name},</p><p>Bienvenue sur RPG Gestionary !</p><p>Nous sommes ravis de vous accueillir. N'hésitez pas à explorer les fonctionnalités de la plateforme.</p><p>Cordialement,<br />L'équipe RPG Gestionary</p>`,
      };

      sendMail(emailDetail)
        .then(() => {
          console.log(`Email sent to ${input.email}`);
        })
        .catch((error) => {
          console.error(`Failed to send email to ${input.email}:`, error);
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

  forgotPassword: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (!user.password) {
        const account = await db.account.findFirst({
          where: { userId: user.id, type: "oauth" },
        });

        if (!account) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No account found for this user",
          });
        }

        return {
          status: 500,
          code: "ACCOUNT_LINKED",
          cause: "Account linked to OAuth provider",
          message: `Votre compte est lié à un compte ${account.provider}. Connectez-vous avec cette méthode pour accéder à votre compte.`,
        };
      }

      // Here you would typically send a password reset email

      const resetLink = `${env.NEXT_PUBLIC_URL}/reset-password?email=${encodeURIComponent(input.email)}`;

      const emailDetails = {
        subject: "Réinitialisation de votre mot de passe",
        to: input.email,
        html: `<p>Bonjour,</p><p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant :</p><p><a href="${resetLink}">Réinitialiser mon mot de passe</a></p><p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>`,
        text: `Bonjour,\n\nPour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant :\n${resetLink}\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.`,
      };
      await sendMail(emailDetails);

      return {
        status: 200,
        code: "RESET_LINK_SENT",
        cause: "Password reset link sent",
        message: "Un lien de réinitialisation a été envoyé à votre email.",
      };
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        newPassword: z
          .string()
          .min(8, "Password must be at least 8 characters"),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const hashedPassword = await hash(input.newPassword, {
        type: argon2id,
      });

      const newUser = await db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      if (!newUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to reset password",
        });
      }

      const emailDetails = {
        subject: "Votre mot de passe a été réinitialisé",
        to: input.email,
        html: `<p>Bonjour,</p><p>Votre mot de passe a été réinitialisé avec succès.</p>`,
        text: `Bonjour,\n\nVotre mot de passe a été réinitialisé avec succès.`,
      };

      await sendMail(emailDetails);

      return newUser;
    }),
});
