import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { UpdateUniverse } from "~/app/_components/univers";
import { Header } from "~/app/_components/navigation";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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
    title: `Modifier ${univers.name} | RPG Gestionary`,
    description: `Modifier l'univers ${univers.name}`,
  };
}

export default async function UniversDetail({ params }: Props) {
  const { slug } = await params;

  const univers = await db.universe.findUnique({
    where: { slug: slug },
  });

  if (!univers) {
    notFound();
  }

  return (
    <HydrateClient>
      <Header back title={`Univers ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <UpdateUniverse univers={univers} />
        </div>
      </main>
    </HydrateClient>
  );
}
