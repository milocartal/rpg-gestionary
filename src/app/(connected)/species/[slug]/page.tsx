import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { SpeciesResume } from "~/app/_components/species";
import { Header } from "~/app/_components/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

import NewSpecies from "~/app/(connected)/species/new/page";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "new") {
    return {
      title: "Nouvel species",
      description: "Création d'un nouvel species",
    };
  }

  const species = await db.species.findUnique({
    where: { slug: slug },
  });

  if (!species) {
    return {
      title: "Espèce introuvable",
      description: "L'species que vous cherchez n'existe pas",
    };
  }

  return {
    title: `${species.name} | RPG Gestionary`,
    description: `Détails de l'species ${species.name}`,
  };
}

export default async function SpeciesDetail({ params }: Props) {
  const { slug } = await params;
  if (slug === "new") {
    return NewSpecies();
  }

  const session = await auth();

  if (!session) {
    redirect("/");
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

  const species = await db.species
    .findUniqueOrThrow({
      where: { slug: slug },
    })
    .catch(() => {
      console.error("Species not found");
      notFound();
    });

  return (
    <HydrateClient>
      <Header back title={`${species.name} | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center gap-4 bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <SpeciesResume species={species} session={session} />
      </main>
    </HydrateClient>
  );
}
