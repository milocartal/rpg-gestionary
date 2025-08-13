import type { Metadata } from "next";
import { forbidden, notFound, unauthorized } from "next/navigation";

import { Header } from "~/app/_components/header/header";
import { CreateStory } from "~/app/_components/story/create";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";
import { canInUniverse } from "~/utils/accesscontrol";

export const metadata: Metadata = {
  title: "Nouvel story",
};

export default async function NewStory() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (!canInUniverse(session).createOwn("story").granted) {
    forbidden();
  }

  const universe = await db.universe.findUnique({
    where: {
      id: session.universeId,
    },
  });

  if (!universe) {
    notFound();
  }

  return (
    <HydrateClient>
      <Header back title={"Créer un story"} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <h1 className="text-text mb-4 text-2xl font-bold">Créer un story</h1>

          <CreateStory universeId={universe.id} />
        </div>
      </main>
    </HydrateClient>
  );
}
