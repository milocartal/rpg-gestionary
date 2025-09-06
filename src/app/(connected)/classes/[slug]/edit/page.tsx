import { type Metadata } from "next";
import { forbidden, notFound, unauthorized } from "next/navigation";

import { Header } from "~/app/_components/navigation";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import { canInUniverse } from "~/utils/accesscontrol";
import { UpdateClass } from "~/app/_components/class";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const classData = await db.class.findUnique({
    where: { slug: slug },
  });

  if (!classData) {
    return {
      title: "Classe introuvable",
      description: "La classe que vous cherchez n'existe pas",
    };
  }

  return {
    title: `Modifier ${classData.name} | RPG Gestionary`,
    description: `Modifier la classe ${classData.name}`,
  };
}

export default async function ClassUpdate({ params }: Props) {
  const { slug } = await params;

  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (!canInUniverse(session).updateOwn("class").granted) {
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

  const classData = await db.class.findUnique({
    where: { slug: slug },
  });

  if (!classData) {
    notFound();
  }

  return (
    <HydrateClient>
      <Header back title={`Modifier ${classData.name} | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <UpdateClass classObject={classData} />
        </div>
      </main>
    </HydrateClient>
  );
}
