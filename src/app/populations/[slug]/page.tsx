import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Header } from "~/app/_components/header/header";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

import NewPopulation from "~/app/populations/new/page";
import { PopulationResume } from "~/app/_components/population";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "new") {
    return {
      title: "Nouvel population",
      description: "Création d'un nouvel population",
    };
  }

  const population = await db.population.findUnique({
    where: { id: slug },
  });

  if (!population) {
    return {
      title: "Population introuvable",
      description: "L'population que vous cherchez n'existe pas",
    };
  }

  return {
    title: `${population.name} | SAGA`,
    description: `Détails de l'population ${population.name}`,
  };
}

export default async function PopulationDetail({ params }: Props) {
  const { slug } = await params;
  if (slug === "new") {
    return NewPopulation();
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

  const population = await db.population
    .findUniqueOrThrow({
      where: { id: slug },
    })
    .catch(() => {
      console.error("Population not found");
      notFound();
    });

  return (
    <HydrateClient>
      <Header back title={`${population.name} | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center gap-4 bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <PopulationResume population={population} session={session} />
      </main>
    </HydrateClient>
  );
}
