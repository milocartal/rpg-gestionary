import { forbidden, notFound, unauthorized } from "next/navigation";

import { auth } from "~/server/auth";

import { HydrateClient } from "~/trpc/server";
import { canInUniverse } from "~/utils/accesscontrol";
import { Header } from "~/app/_components/navigation/header/header";
import { InviteUserToUniverse } from "~/app/_components/user/universe";
import { db } from "~/server/db";
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
    title: `Créer un personnage | ${universe.Universe.name}`,
    description: `Créer un personnage dans l'univers ${universe.Universe.name}`,
  };
}

export default async function NewMember() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (!canInUniverse(session).createAny("invite").granted) {
    forbidden();
  }

  const universe = await db.universe.findFirst({
    where: {
      Users: {
        some: {
          universeId: session.universeId,
        },
      },
    },
  });

  if (!universe) {
    forbidden();
  }

  return (
    <HydrateClient>
      <Header title={`Inviter un membre | ${universe.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 py-10 pt-24">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <InviteUserToUniverse universeId={universe.id} />
        </div>
      </main>
    </HydrateClient>
  );
}
