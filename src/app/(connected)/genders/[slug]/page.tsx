import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { UpdateGender } from "~/app/_components/gender";
import { Header } from "~/app/_components/navigation";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const gender = await db.gender.findUnique({
    where: { slug: slug },
  });

  if (!gender) {
    return {
      title: "Genre introuvable | RPG Gestionary",
      description: "Le genre que vous cherchez n'existe pas",
    };
  }

  return {
    title: `Modifier ${gender.name} | RPG Gestionary`,
    description: `Modifier le genre ${gender.name}`,
  };
}

export default async function GenderUpdate({ params }: Props) {
  const { slug } = await params;

  const gender = await db.gender.findUnique({
    where: { slug: slug },
  });

  if (!gender) {
    notFound();
  }

  return (
    <HydrateClient>
      <Header back title={`Mise à jour du genre: ${gender.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <UpdateGender gender={gender} />
        </div>
      </main>
    </HydrateClient>
  );
}
