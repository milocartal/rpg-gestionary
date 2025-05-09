import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { UpdateSexe } from "~/app/_components/sexe";
import { Header } from "~/app/_components/header/header";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const sexe = await db.sexe.findUnique({
    where: { id: slug },
  });

  if (!sexe) {
    return {
      title: "Sexe introuvable | SAGA",
      description: "La sexe de base que vous cherchez n'existe pas",
    };
  }

  return {
    title: `Modifier ${sexe.name} | SAGA`,
    description: `Modifier la compténce de base ${sexe.name}`,
  };
}

export default async function SexeUpdate({ params }: Props) {
  const { slug } = await params;

  const sexe = await db.sexe.findUnique({
    where: { id: slug },
  });

  if (!sexe) {
    notFound();
  }

  return (
    <HydrateClient>
      <Header back title={`Mise à jour du sexe: ${sexe.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <UpdateSexe sexe={sexe} />
        </div>
      </main>
    </HydrateClient>
  );
}
