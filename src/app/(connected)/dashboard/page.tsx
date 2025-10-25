import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Header } from "~/app/_components/navigation";
import { db } from "~/server/db";
import { UniversesList } from "~/app/_components/univers/list";

export default async function Dashboard() {
  const session = await auth();

  const univers = await db.userToUniverse.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      Universe: true,
    },
  });

  const characters = await db.character.findMany({
    where: {
      OR: [{ ownerId: session?.user.id }, { controlledById: session?.user.id }],
    },
  });

  return (
    <HydrateClient>
      <Header
        title={`Tableau de bord ${session ? `- ${session.user.name}` : ""}`}
      />
      <main className="relative flex min-h-screen flex-col items-center justify-start gap-12 p-6 pt-24">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <h2 className="mb-4 text-xl font-bold">Mes univers</h2>
          <UniversesList universes={univers} />

          <h2 className="mb-4 text-xl font-bold">Mes personnages</h2>
        </div>
      </main>
    </HydrateClient>
  );
}
