import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { UpdateItem } from "~/app/_components/item";
import { Header } from "~/app/_components/navigation";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const item = await db.item.findUnique({
    where: { slug: slug },
  });

  if (!item) {
    return {
      title: "Objet introuvable | RPG Gestionary",
      description: "L'objet que vous cherchez n'existe pas",
    };
  }

  return {
    title: `Modifier ${item.name} | RPG Gestionary`,
    description: `Modifier l'objet de base ${item.name}`,
  };
}

export default async function UniversDetail({ params }: Props) {
  const { slug } = await params;

  const item = await db.item.findUnique({
    where: { slug: slug },
  });

  if (!item) {
    notFound();
  }

  return (
    <HydrateClient>
      <Header
        back
        title={`Mise à jour de la compétence de base: ${item.name}`}
      />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <UpdateItem item={item} />
        </div>
      </main>
    </HydrateClient>
  );
}
