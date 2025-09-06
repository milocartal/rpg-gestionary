import { type Metadata } from "next";
import { forbidden, notFound, unauthorized } from "next/navigation";

import { UpdatePopulation } from "~/app/_components/population";
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
  const population = await db.population.findUnique({
    where: { slug: slug },
  });

  if (!population) {
    return {
      title: "Population introuvable",
      description: "L'population que vous cherchez n'existe pas",
    };
  }

  return {
    title: `Modifier ${population.name} | RPG Gestionary`,
    description: `Modifier la population ${population.name}`,
  };
}

export default async function PopulationDetail({ params }: Props) {
  const { slug } = await params;

  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (!canInUniverse(session).updateOwn("population").granted) {
    forbidden();
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

  const population = await db.population.findUnique({
    where: { slug: slug },
  });

  if (!population) {
    notFound();
  }

  return (
    <HydrateClient>
      <Header back title={`Modifier ${population.name} | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <UpdatePopulation population={population} />
        </div>
      </main>
    </HydrateClient>
  );
}
