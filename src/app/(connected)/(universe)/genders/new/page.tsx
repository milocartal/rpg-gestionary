import type { Metadata } from "next";
import { notFound, unauthorized } from "next/navigation";
import { CreateGender } from "~/app/_components/gender";

import { Header } from "~/app/_components/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";

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
    title: `Nouveau genre | ${universe.Universe.name}`,
    description: `Créer un genre dans l'univers ${universe.Universe.name}`,
  };
}

export default async function NewGender() {
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

  return (
    <HydrateClient>
      <Header back title={`Créer un genre | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <h1 className="text-text mb-4 text-2xl font-bold">Créer un genre</h1>

          <CreateGender univers={univers} />
        </div>
      </main>
    </HydrateClient>
  );
}
