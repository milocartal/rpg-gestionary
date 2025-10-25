import { notFound, unauthorized } from "next/navigation";

import { Header } from "~/app/_components/navigation";
import { Link } from "~/app/_components/ui/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";
import { DataTableClass } from "~/app/_components/class";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth(); // just to ensure user is authenticated

  const universe = await db.userToUniverse
    .findFirstOrThrow({
      where: {
        userId: session?.user.id,
        universeId: session?.universeId,
      },
      include: {
        Universe: true,
      },
    })
    .catch(() => {
      console.log("Univers not found");
      notFound();
    });

  return {
    title: `Classes | ${universe.Universe.name}`,
    description: `Gérer les classes dans l'univers ${universe.Universe.name}`,
  };
}

export default async function Classes() {
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

  const classes = await db.class.findMany({
    where: {
      universeId: univers.id,
    },
  });

  return (
    <HydrateClient>
      <Header title={`Classes | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <DataTableClass data={classes}>
            <Link href="/classes/new" className="w-full lg:w-auto">
              Créer une classe
            </Link>
          </DataTableClass>
        </div>
      </main>
    </HydrateClient>
  );
}
