import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { UniversResume } from "~/app/_components/univers";
import { Header } from "~/app/_components/navigation";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";

import NewUnivers from "~/app/(connected)/universes/new/page";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "new") {
    return {
      title: "Nouvel univers",
      description: "Création d'un nouvel univers",
    };
  }

  const univers = await db.universe.findUnique({
    where: { slug: slug },
  });

  if (!univers) {
    return {
      title: "Univers introuvable",
      description: "L'univers que vous cherchez n'existe pas",
    };
  }

  return {
    title: `${univers.name} | RPG Gestionary`,
    description: `Détails de l'univers ${univers.name}`,
  };
}

export default async function UniversDetail({ params }: Props) {
  const { slug } = await params;
  if (slug === "new") {
    return NewUnivers();
  }

  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const univers = await db.universe
    .findUniqueOrThrow({
      where: { slug: slug },
    })
    .catch(() => {
      console.error("Univers not found");
      notFound();
    });

  const species = await db.species.count({
    where: { universeId: univers.id },
  });
  const populations = await db.population.count({
    where: { universeId: univers.id },
  });

  const pets = await db.pet.count({
    where: { Story: { universeId: univers.id } },
  });
  const characters = await db.character.count({
    where: { Story: { universeId: univers.id } },
  });

  const stories = await db.story.count({
    where: { universeId: univers.id },
  });

  return (
    <HydrateClient>
      <Header back title={`Univers ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center gap-4 bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <UniversResume
          univers={univers}
          species={species}
          populations={populations}
          pets={pets}
          characters={characters}
          stories={stories}
          session={session}
        />
      </main>
    </HydrateClient>
  );
}
