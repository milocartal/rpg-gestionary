import { notFound, unauthorized } from "next/navigation";

import { Header } from "~/app/_components/navigation";
import { Link } from "~/app/_components/ui/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";
import { DataTableStory } from "~/app/_components/story/datatable";
import { canInUniverse } from "~/utils/accesscontrol";

export const metadata = {
  title: "Liste des histoires | RPG Gestionary",
};

export default async function Stories() {
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
      console.log("Univers not found");
      notFound();
    });

  if (!universe) {
    notFound();
  }

  const stories = await db.story.findMany({
    where: {
      universeId: universe.id,
    },
  });

  return (
    <HydrateClient>
      <Header title={"Liste des story | RPG Gestionary"} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <DataTableStory data={stories}>
            {canInUniverse(session).createOwn("story").granted && (
              <Link href="/stories/new" className="w-full lg:w-auto">
                Créer une histoire
              </Link>
            )}
          </DataTableStory>
        </div>
      </main>
    </HydrateClient>
  );
}
