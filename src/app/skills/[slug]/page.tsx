import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { UpdateBaseSkill } from "~/app/_components/baseSkill";
import { Header } from "~/app/_components/header/header";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const baseSkill = await db.baseSkill.findUnique({
    where: { id: slug },
  });

  if (!baseSkill) {
    return {
      title: "Compétence introuvable | SAGA",
      description: "La compétence de base que vous cherchez n'existe pas",
    };
  }

  return {
    title: `Modifier ${baseSkill.name} | SAGA`,
    description: `Modifier la compténce de base ${baseSkill.name}`,
  };
}

export default async function UniversDetail({ params }: Props) {
  const { slug } = await params;

  const baseSkill = await db.baseSkill.findUnique({
    where: { id: slug },
  });

  if (!baseSkill) {
    notFound();
  }

  return (
    <HydrateClient>
      <Header
        back
        title={`Mise à jour de la compétence de base: ${baseSkill.name}`}
      />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <UpdateBaseSkill baseSkill={baseSkill} />
        </div>
      </main>
    </HydrateClient>
  );
}
