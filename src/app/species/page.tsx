import { notFound, unauthorized } from "next/navigation";

import { Header } from "~/app/_components/header/header";
import { Link } from "~/app/_components/ui/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";
import { DataTableSpecies } from "~/app/_components/species";

export default async function Species() {
  const session = await auth();

  if (!session) {
    unauthorized();
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

  const species = await db.species.findMany({
    where: {
      universeId: univers.id,
    },
  });

  return (
    <HydrateClient>
      <Header title={`Espèces | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <DataTableSpecies data={species}>
            <Link href="/species/new" className="w-full lg:w-auto">
              Créer une espèce
            </Link>
          </DataTableSpecies>
        </div>
      </main>
    </HydrateClient>
  );
}
