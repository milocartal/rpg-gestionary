import type { Metadata } from "next";
import { forbidden, notFound, unauthorized } from "next/navigation";

import { Header } from "~/app/_components/header/header";
import { CreateItem } from "~/app/_components/item";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";
import { canInUniverse } from "~/utils/accesscontrol";

export const metadata: Metadata = {
  title: "Nouvel items",
};

export default async function NewSpecies() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (!canInUniverse(session).createOwn("item").granted) {
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
      <Header back title={`Créer un objet | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <h1 className="text-text mb-4 text-2xl font-bold">Créer un objet</h1>

          <CreateItem universe={univers} />
        </div>
      </main>
    </HydrateClient>
  );
}
