// app/robots.ts
import type { MetadataRoute } from "next";
import { env } from "~/env";

const APP_URL = env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
const ENV = env.NEXT_PUBLIC_NODE_ENV as string;

export default function robots(): MetadataRoute.Robots {
  const origin = new URL(APP_URL).origin;
  const isProd = ENV === "production";

  // En dev/preview : on bloque tout pour éviter l’indexation accidentelle
  if (!isProd) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: [], // pas de sitemap en non-prod
      host: origin,
    };
  }

  // En production : on autorise, mais on protège les zones privées et les pages techniques
  return {
    rules: [
      {
        userAgent: "*",
        // Laisser vide "allow" = tout est autorisé par défaut
        disallow: [
          // Endpoints techniques
          "/api/*",
          "/api/auth/*", // NextAuth
          "/api/trpc/*", // tRPC
          "/_next/*",
          "/server/*",
          "/static/*",
          "/_components/*",

          // Espaces privés/compte/back-office (adapter selon ton app)
          "/admin/*",
          "/dashboard/*",
          "/app/*",
          "/account/*",
          "/profil/*",
          "/settings/*",
          "/private/*",
          "/draft/*",

          // Pages peu utiles en SEO : recherche, filtres, pagination par querystring
          "/recherche*",
          "/search*",
          "/*?*q=*",
          "/*?*page=*",
          "/*?*cursor=*",
          "/*?*sort=*",
          "/*?*filter=*",
        ],
        // Optionnel : ralentir un peu les crawlers agressifs
        crawlDelay: 2,
      },
    ],
    sitemap: [`${origin}/sitemap.xml`],
    host: origin,
  };
}
