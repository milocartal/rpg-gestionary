import { notFound, unauthorized } from "next/navigation";

import { Header } from "~/app/_components/navigation";
import { Link } from "~/app/_components/ui/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";
import { DataTablePopulation } from "~/app/_components/population";

export default async function Population() {
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

  const population = await db.population.findMany({
    where: {
      universeId: univers.id,
    },
    include: {
      Modifiers: true,
    },
  });

  return (
    <HydrateClient>
      <Header title={`Populations | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <DataTablePopulation data={population}>
            <Link href="/populations/new" className="w-full lg:w-auto">
              Créer un population
            </Link>
          </DataTablePopulation>
        </div>
      </main>
    </HydrateClient>
  );
}
