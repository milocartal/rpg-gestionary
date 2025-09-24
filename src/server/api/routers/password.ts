import { TRPCError } from "@trpc/server";
import { argon2id, hash } from "argon2";

import { sendMail } from "~/lib/mailer";

import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

import { issueToken, verifyAndGetToken } from "~/server/auth/password-token";

export const passwordRouter = createTRPCRouter({
  forgot: publicProcedure
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
      const token = await issueToken(user.id, "RESET");
      if (!token) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to issue reset token",
        });
      }

      const resetLink = token.url;

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

  set: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    )
    .mutation(async ({ input }) => {
      const verified = await verifyAndGetToken(input.token, "INVITE");

      if (!verified) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid or expired token",
        });
      }

      const user = await db.user.findUnique({
        where: { id: verified.userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (!user.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not have an email set",
        });
      }

      if (user.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already has a password set",
        });
      }

      const hashedPassword = await hash(input.password, {
        type: argon2id,
      });

      const newUser = await db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      if (!newUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set password",
        });
      }

      const emailDetails = {
        subject: "Votre mot de passe a été défini",
        to: user.email,
        html: `<p>Bonjour,</p><p>Votre mot de passe a été défini avec succès.</p>`,
        text: `Bonjour,\n\nVotre mot de passe a été défini avec succès.`,
      };

      await sendMail(emailDetails);

      return newUser;
    }),

  reset: publicProcedure
    .input(
      z.object({
        token: z.string(),
        newPassword: z
          .string()
          .min(8, "Password must be at least 8 characters"),
      }),
    )
    .mutation(async ({ input }) => {
      const verified = await verifyAndGetToken(input.token, "RESET");

      if (!verified) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid or expired token",
        });
      }

      const user = await db.user.findUnique({
        where: { id: verified.userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (!user.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not have an email set",
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
        to: user.email,
        html: `<p>Bonjour,</p><p>Votre mot de passe a été réinitialisé avec succès.</p>`,
        text: `Bonjour,\n\nVotre mot de passe a été réinitialisé avec succès.`,
      };

      await sendMail(emailDetails);

      return newUser;
    }),
});
