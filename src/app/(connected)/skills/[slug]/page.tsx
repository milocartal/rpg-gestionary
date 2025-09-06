import { type Metadata } from "next";
import { forbidden, notFound, unauthorized } from "next/navigation";

import { UpdateBaseSkill } from "~/app/_components/baseSkill";
import { Header } from "~/app/_components/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";
import { canInUniverse } from "~/utils/accesscontrol";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const baseSkill = await db.baseSkill.findUnique({
    where: { slug: slug },
  });

  if (!baseSkill) {
    return {
      title: "Compétence introuvable | RPG Gestionary",
      description: "La compétence de base que vous cherchez n'existe pas",
    };
  }

  return {
    title: `Modifier ${baseSkill.name} | RPG Gestionary`,
    description: `Modifier la compténce de base ${baseSkill.name}`,
  };
}

export default async function BaseSkillUpdate({ params }: Props) {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (
    !canInUniverse(session).updateOwn("base-skill").granted ||
    !session.universeId
  ) {
    forbidden();
  }

  const universe = await db.universe.findUnique({
    where: { id: session.universeId },
  });

  if (!universe) {
    notFound();
  }

  const { slug } = await params;

  const baseSkill = await db.baseSkill.findUnique({
    where: { slug: slug },
  });

  if (!baseSkill) {
    notFound();
  }

  const baseAttributes = await db.baseAttribute.findMany({
    where: { universeId: universe.id },
  });

  return (
    <HydrateClient>
      <Header
        back
        title={`Mise à jour de la compétence de base: ${baseSkill.name}`}
      />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <UpdateBaseSkill
            baseSkill={baseSkill}
            baseAttributes={baseAttributes}
          />
        </div>
      </main>
    </HydrateClient>
  );
}
