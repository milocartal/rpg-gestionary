import { notFound, unauthorized } from "next/navigation";

import { Header } from "~/app/_components/navigation";
import { Link } from "~/app/_components/ui/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";

import { DataTableGender } from "~/app/_components/gender";
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
    title: `Genres | ${universe.Universe.name}`,
    description: `Gérer les genres dans l'univers ${universe.Universe.name}`,
  };
}

export default async function Genders() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  const universe = await db.universe
    .findFirstOrThrow({
      where: {
        Users: {
          some: {
            universeId: session.universeId,
          },
        },
      },
    })
    .catch(() => {
      console.log("Univers not found");
      notFound();
    });

  const genders = await db.gender.findMany({
    where: {
      universeId: universe.id,
    },
  });

  return (
    <HydrateClient>
      <Header title={`Genres | ${universe.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <DataTableGender data={genders}>
            <Link href="/genders/new" className="w-full lg:w-auto">
              Créer un genre
            </Link>
          </DataTableGender>
        </div>
      </main>
    </HydrateClient>
  );
}
