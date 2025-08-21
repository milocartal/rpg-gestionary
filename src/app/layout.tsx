import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";
import { SidebarProvider } from "~/app/_components/ui/sidebar";

export const metadata: Metadata = {
  title: "RPG Gestionary",
  description: "Service d'Admistration et de Gestion des Aventures",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "icon", url: "/favicon.svg" },
  ],
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
        <title>RPG Gestionary</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Service d'Administration et de Gestion des Aventures"
        />
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
