import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Header } from "~/app/_components/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";

import NewClass from "~/app/(connected)/(universe)/classes/new/page";
import { ClassResume } from "~/app/_components/class";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "new") {
    return {
      title: "Nouvelle classe",
      description: "Création d'une nouvelle classe",
    };
  }

  const classData = await db.class.findUnique({
    where: { slug: slug },
  });

  if (!classData) {
    return {
      title: "Classe introuvable",
      description: "L'class que vous cherchez n'existe pas",
    };
  }

  return {
    title: `${classData.name} | RPG Gestionary`,
    description: `Détails de la classe ${classData.name}`,
  };
}

export default async function ClassDetail({ params }: Props) {
  const { slug } = await params;
  if (slug === "new") {
    return NewClass();
  }

  const session = await auth();

  if (!session) {
    redirect("/");
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

  const classData = await db.class
    .findUniqueOrThrow({
      where: { slug: slug },
    })
    .catch(() => {
      console.error("Class not found");
      notFound();
    });

  return (
    <HydrateClient>
      <Header back title={`${classData.name} | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center gap-4 bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <ClassResume classData={classData} session={session} />
      </main>
    </HydrateClient>
  );
}
