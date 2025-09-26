import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";
import { SidebarProvider } from "~/app/_components/ui/sidebar";
import { env } from "~/env";

const APP_URL = new URL(env.NEXT_PUBLIC_URL ?? "http://localhost:3000"); // prod URL absolue

export const metadata: Metadata = {
  metadataBase: APP_URL,
  title: {
    default: "RPG-Gestionary",
    template: "%s · RPG-Gestionary",
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
    "gestionnaire",
  ],
  applicationName: "RPG-Gestionary",
  authors: [
    { name: "RPG-Gestionary", url: APP_URL },
    { name: "Milo Cartal", url: "https://milocartal.com" },
  ],
  creator: "Milo Cartal",
  publisher: "Milo Cartal",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    title: "RPG-Gestionary",
    statusBarStyle: "default",
    capable: true,
  },
  openGraph: {
    title: "RPG-Gestionary - Plateforme de gestion de JDR",
    description:
      "Un service de gestion de fiches personnages, familiers et bien plus encore pour JDR.",
    url: APP_URL,
    siteName: "RPG-Gestionary",
    images: [
      {
        url: "/og-image.png",
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
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.svg" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  category: "games",
};

export const viewport: Viewport = {
  themeColor: "#f5e9cf",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      <body>
        <TRPCReactProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
