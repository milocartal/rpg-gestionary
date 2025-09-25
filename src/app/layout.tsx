import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";
import { SidebarProvider } from "~/app/_components/ui/sidebar";
import { env } from "~/env";

const APP_NAME = "RPG Gestionary"; // change le nom
const APP_URL = env.NEXT_PUBLIC_URL ?? "https://example.com"; // prod URL absolue

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: "%s · " + APP_NAME,
  },
  description:
    "Plateforme de gestion de fiches personnages, familiers et bien plus encore pour JDR.",
  keywords: [
    "JDR",
    "fiches personnages",
    "fiches familiers",
    "tabletop",
    "rôles",
    "jeu de rôle",
    "RPG",
    "jeu de société",
    "plateau",
    "gestion de jeu",
  ],
  applicationName: APP_NAME,
  authors: [
    { name: APP_NAME },
    { name: "Milo Cartal", url: "https://milocartal.com" },
  ],
  creator: "Milo Cartal",
  publisher: "Milo Cartal",
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    title: "RPG-Gestionary",
    statusBarStyle: "default",
    capable: true,
  },
  openGraph: {
    title: "RPG-Gestionary - Plateforme de gestion de JDR",
    description:
      "Un service de gestion de fiches personnages, familiers et bien plus encore pour JDR.",
    url: new URL(env.NEXT_PUBLIC_URL ?? "http://localhost:3000"),
    siteName: "RPG-Gestionary",
    images: [
      {
        url: "/icon0.svg",
        width: 1024,
        height: 1024,
        alt: "RPG-Gestionary - Plateforme de gestion de JDR",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RPG-Gestionary - Plateforme de gestion de JDR",
    description:
      "Un service de gestion de fiches personnages, familiers et bien plus encore pour JDR.",
    images: ["/icon1.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.svg" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  category: "games",
};

export const viewport: Viewport = {
  themeColor: "#f5e9cf",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${geist.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon1.png" />
        <link
          rel="icon"
          type="image/svg+xml"
          sizes="1024x1024"
          href="/favicon.svg"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f5e9cf" />
        <meta name="apple-mobile-web-app-title" content="RPG-Gestionary" />
      </head>
      <body>
        <TRPCReactProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
