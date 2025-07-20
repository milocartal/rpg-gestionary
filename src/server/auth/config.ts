import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import type { JWT } from "next-auth/jwt";

import type { Session as SessionAuth } from "next-auth";

import { db } from "~/server/db";

import { verify } from "argon2";
import { z } from "zod";

const sessionSchema = z.object({
  universeId: z.string().optional(),
  Univers: z
    .object({
      id: z.string(),
      role: z.string(),
    })
    .optional(),
});

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
        email: {
          label: "Email",
          type: "email",
          placeholder: "exemple@cart-all.io",
        },
        password: {
          label: "Mot de passe",
          type: "password",
          placeholder: "******",
        },
      },
      authorize: async (credentials) => {
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

        return {
          id: user.id,
          name: user.name ?? user.email,
          email: user.email,
        };
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
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }: { session: SessionAuth; token: JWT }) {
      if (session.user && token) {
        const user = await db.user.findUnique({
          where: { email: session.user.email! },
        });
        if (!user) {
          console.warn("User not found");
          return session;
        }
        session.user.id = user.id;
        session.user.role = user.role || "user"; // Default role if not set

        if (!session.universeId && !session.Univers) {
          if (token.universeId && token.Univers) {
            const temp = token.Univers as {
              id: string;
              role: string;
            };
            session.universeId = token.universeId as string;
            session.Univers = {
              id: temp.id,
              role: temp.role,
            };
          } else {
            const univers = await db.userToUniverse.findFirst({
              where: {
                userId: user.id,
              },
            });
            if (univers) {
              session.universeId = univers.id;
              session.Univers = {
                id: univers.id,
                role: univers.role,
              };
            } else {
              console.warn("No universe found for user");
            }
          }
        }

        return session;
      }

      return session;
    },
    async jwt({ token, account, user, trigger, session }) {
      if (trigger === "update") {
        const parsedSession = sessionSchema.safeParse(session);
        if (!parsedSession.success) {
          console.error("Session validation failed:", parsedSession.error);
          return token;
        }
        const univers = await db.userToUniverse.findFirst({
          where: {
            universeId: parsedSession.data.universeId,
          },
        });
        if (univers) {
          token.universeId = univers.id;
          token.Univers = {
            id: univers.id,
            role: univers.role,
          };
        } else {
          console.warn("univers not found");
        }
      } else if (trigger === "signIn") {
        const univers = await db.userToUniverse.findFirst({
          where: {
            userId: user.id,
          },
        });
        if (univers) {
          token.universeId = univers.id;
          token.Univers = {
            id: univers.id,
            role: univers.role,
          };
        } else {
          console.warn("univers not found");
        }
      }

      if (user) {
        token.name = user.name;
      }

      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }

      return token;
    },
  },
} satisfies NextAuthConfig;
