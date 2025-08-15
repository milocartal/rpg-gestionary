import type { Metadata } from "next";
import { forbidden, notFound, unauthorized } from "next/navigation";

import { Header } from "~/app/_components/header/header";
import { CreateSpecies } from "~/app/_components/species/create";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";
import { canInUniverse } from "~/utils/accesscontrol";

export const metadata: Metadata = {
  title: "Nouvel species",
};

export default async function NewSpecies() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (!canInUniverse(session).createOwn("species").granted) {
    forbidden();
  }

  const univers = await db.universe
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
      console.log("Univers not found");
      notFound();
    });

  return (
    <HydrateClient>
      <Header back title={`Créer une espèce | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <h1 className="text-text mb-4 text-2xl font-bold">
            Créer un species
          </h1>

          <CreateSpecies univers={univers} />
        </div>
      </main>
    </HydrateClient>
  );
}
