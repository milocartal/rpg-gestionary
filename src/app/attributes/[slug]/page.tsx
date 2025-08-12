import { type Metadata } from "next";
import { forbidden, notFound, unauthorized } from "next/navigation";

import { UpdateBaseAttribute } from "~/app/_components/baseAttribute";
import { Header } from "~/app/_components/header/header";
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

  const baseAttribute = await db.baseAttribute.findUnique({
    where: { id: slug },
  });

  if (!baseAttribute) {
    return {
      title: "Attribut introuvable | SAGA",
      description: "L'attribut de base que vous cherchez n'existe pas",
    };
  }

  return {
    title: `Modifier ${baseAttribute.name} | SAGA`,
    description: `Modifier l'attribut de base ${baseAttribute.name}`,
  };
}

export default async function UniversDetail({ params }: Props) {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (
    !canInUniverse(session).updateOwn("base-attribute").granted ||
    !session.universeId
  ) {
    forbidden();
  }

  const { slug } = await params;

  const baseAttribute = await db.baseAttribute.findUnique({
    where: { id: slug },
  });

  if (!baseAttribute) {
    notFound();
  }

  return (
    <HydrateClient>
      <Header
        back
        title={`Mise à jour de l'attribut de base: ${baseAttribute.name}`}
      />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <UpdateBaseAttribute baseAttribute={baseAttribute} />
        </div>
      </main>
    </HydrateClient>
  );
}
