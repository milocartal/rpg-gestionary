import type { Metadata } from "next";
import { notFound, unauthorized } from "next/navigation";
import { CreateClass } from "~/app/_components/class/create";

import { Header } from "~/app/_components/navigation";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Nouvelle classe",
};

export default async function NewClass() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  const universe = await db.universe
    .findFirstOrThrow({
      where: {
        Users: {
          some: {
            id: session.universeId,
          },
        },
      },
    })
    .catch(() => {
      console.log("Univers introuvable");
      notFound();
    });

  return (
    <HydrateClient>
      <Header back title={"Créer une classe"} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <h1 className="text-text mb-4 text-2xl font-bold">
            Créer une classe
          </h1>

          <CreateClass universe={universe} />
        </div>
      </main>
    </HydrateClient>
  );
}
