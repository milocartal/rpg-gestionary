import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

import type { Session as SessionAuth } from "next-auth";
import { type AdapterUser } from "next-auth/adapters";

import { db } from "~/server/db";

import { verify } from "argon2";

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
    universeId?: string;
    Univers?: {
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
    GithubProvider,
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        console.log("credentials", credentials);
        if (!credentials?.email || !credentials.password) {
          console.warn("Missing credentials");
          return null;
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user?.password) {
          console.warn("User not found or password not set");
          return null;
        }
        const isValid = await verify(
          user.password,
          credentials.password as string,
        );

        if (!isValid) {
          console.warn("Invalid password");
          return null;
        }
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
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
  session: {
    strategy: "database",
  },
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
      if (trigger === "update") {
        const univers = await db.userToUniverse.findFirst({
          where: {
            universeId: newSession.universeId,
          },
        });
        if (univers) {
          session.universeId = univers.id;
          session.Univers = {
            id: univers.id,
            role: univers.role,
          };

          await db.session.updateMany({
            where: {
              user: {
                id: user.id,
              },
            },
            data: {
              universeId: univers.id,
            },
          });

          return {
            ...session,
            user: {
              ...session.user,
              id: user.id,
            },
            Universe: {
              id: univers.id,
              role: univers.role,
            },
          };
        } else {
          console.warn("univers not found");
        }
      }

      if (session.Univers) {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
          },
          Universe: {
            id: session.Univers.id,
            role: session.Univers.role,
          },
        };
      }

      if (session.universeId) {
        const univers = await db.userToUniverse.findFirst({
          where: {
            id: session.universeId,
          },
        });
        if (univers) {
          return {
            ...session,
            user: {
              ...session.user,
              id: user.id,
            },
            Universe: {
              id: univers.id,
              role: univers.role,
            },
          };
        } else {
          console.warn("univers not found");
        }
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
