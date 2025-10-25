import type { Metadata } from "next";
import { notFound, unauthorized } from "next/navigation";
import { CreateCharacter } from "~/app/_components/character";

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
    title: `Créer un personnage | ${universe.Universe.name}`,
    description: `Créer un personnage dans l'univers ${universe.Universe.name}`,
  };
}

export default async function NewCharacter() {
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
      include: {
        Genders: true,
        BaseAttributes: true,
        Stories: true,
        Classes: true,
        Populations: {
          include: {
            Modifiers: {
              include: {
                BaseAttribute: true,
                BaseSkill: true,
              },
            },
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
      <Header back title={`Créer un personnage | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <h1 className="text-text mb-4 text-2xl font-bold">
            Créer un personnage
          </h1>

          <CreateCharacter
            attributes={univers.BaseAttributes}
            populations={univers.Populations}
            stories={univers.Stories}
            genders={univers.Genders}
            classes={univers.Classes}
          />
        </div>
      </main>
    </HydrateClient>
  );
}
