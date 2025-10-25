import { forbidden, notFound, unauthorized } from "next/navigation";

import { Header } from "~/app/_components/navigation";
import { Link } from "~/app/_components/ui/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

import { HydrateClient } from "~/trpc/server";

import { DataTableCharacter } from "~/app/_components/character/datatable";
import { canInUniverse } from "~/utils/accesscontrol";

export default async function Characters() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (!canInUniverse(session).readOwn("character").granted) {
    forbidden();
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
      console.log("Univers not found");
      notFound();
    });

  const characters = await db.character.findMany({
    where: {
      Story: {
        universeId: universe.id,
      },
      ownerId: session.user.id,
    },
    include: {
      Story: true,
      Attributes: true,
      Skills: true,
      Modifiers: true,
      Classes: true,
      Population: true,
      Pets: true,
      Owner: true,
    },
  });

  return (
    <HydrateClient>
      <Header title={`Personnages | ${universe.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <DataTableCharacter data={characters}>
            <Link href="/characters/new" className="w-full lg:w-auto">
              Créer un personnage
            </Link>
          </DataTableCharacter>
        </div>
      </main>
    </HydrateClient>
  );
}
