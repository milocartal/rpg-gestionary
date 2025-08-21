import { type Metadata } from "next";
import { forbidden, notFound, unauthorized } from "next/navigation";

import { UpdateSpecies } from "~/app/_components/species";
import { Header } from "~/app/_components/navigation";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import { canInUniverse } from "~/utils/accesscontrol";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const species = await db.species.findUnique({
    where: { id: slug },
  });

  if (!species) {
    return {
      title: "Species introuvable",
      description: "L'species que vous cherchez n'existe pas",
    };
  }

  return {
    title: `Modifier ${species.name} | RPG Gestionary`,
    description: `Modifier l'species ${species.name}`,
  };
}

export default async function SpeciesDetail({ params }: Props) {
  const { slug } = await params;

  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (
    !canInUniverse(session).updateOwn("species").granted ||
    !session.universeId
  ) {
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
      console.log("Species not found");
      notFound();
    });

  const species = await db.species.findUnique({
    where: { id: slug },
  });

  if (!species) {
    notFound();
  }

  return (
    <HydrateClient>
      <Header back title={`${species.name} | ${universe.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <UpdateSpecies species={species} />
        </div>
      </main>
    </HydrateClient>
  );
}
