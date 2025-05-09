import { notFound } from "next/navigation";

import { Header } from "~/app/_components/header/header";
import { Link } from "~/app/_components/ui/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";
import { DataTableSpecies } from "~/app/_components/species";

export default async function Univers() {
  const session = await auth();

  if (!session) {
    notFound();
  }

  const univers = await db.univers
    .findFirstOrThrow({
      where: {
        Users: {
          some: {
            id: session.universId,
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
      universId: univers.id,
    },
  });

  return (
    <HydrateClient>
      <Header title={"Univers"} />
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
