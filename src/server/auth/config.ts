import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import type { Session as SessionAuth } from "next-auth";
import { type AdapterUser } from "next-auth/adapters";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
    univers?: {
      id: string;
      role: string;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  trustHost: true,
  providers: [
    DiscordProvider,
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    async session({
      session,
      user,
      trigger,
      newSession,
    }: {
      session: SessionAuth;
      user: AdapterUser;
      trigger?: string;
      newSession: SessionAuth;
    }) {
      if (trigger === "update" && user) {
        if (
          session &&
          newSession &&
          session.univers &&
          newSession.univers &&
          session.univers?.id !== newSession.univers?.id
        ) {
          const univers = await db.univers.findFirst({
            where: {
              id: newSession.univers.id,
            },
            include: {
              Users: true,
            },
          });
          if (univers) {
            session.univers = {
              id: univers.id,
              role: univers.Users.find((temp) => temp.userId === user.id)!.role,
            };
          }
        }
      }

      if (session.univers) {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
          },
          univers: {
            id: session.univers.id,
            role: session.univers.role,
          },
        };
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
} satisfies NextAuthConfig;
