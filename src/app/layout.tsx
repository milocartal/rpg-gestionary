import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";
import { SidebarProvider } from "~/app/_components/ui/sidebar";
import Navbar from "~/app/_components/nav/navbar";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export const metadata: Metadata = {
  title: "SAGA",
  description: "Service d'Admistration et de Gestion des Aventures",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const univers = await db.univers.findMany({
    where: {
      Users: {
        some: {
          userId: session?.user.id,
        },
      },
    },
    include: {
      Users: true,
    },
  });
  return (
    <html lang="fr" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <SidebarProvider>
            <Navbar session={session} univers={univers} />
            <main className="relative max-h-screen min-h-screen w-full overflow-y-auto">
              {children}
            </main>
          </SidebarProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
