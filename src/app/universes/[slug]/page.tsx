import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { UniversResume } from "~/app/_components/univers";
import { Header } from "~/app/_components/header/header";
// import { Link } from "~/app/_components/ui/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

import NewUnivers from "~/app/universes/new/page";

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
    where: { id: slug },
  });

  if (!univers) {
    return {
      title: "Univers introuvable",
      description: "L'univers que vous cherchez n'existe pas",
    };
  }

  return {
    title: `${univers.name} | SAGA`,
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
      where: { id: slug },
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

  const animals = await db.animal.count({
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
          animals={animals}
          characters={characters}
          stories={stories}
          session={session}
        />
        {/* <section className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <h2 className="text-text mt-2 text-2xl font-bold">
            Services de la univers
          </h2>
          <DataTableService data={services}>
            <Link href={`/services/new?categoryId=${univers.id}`}>
              Créer un service
            </Link>
          </DataTableService>
        </section> */}
      </main>
    </HydrateClient>
  );
}
