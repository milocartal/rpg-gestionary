import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreateBaseSkill } from "~/app/_components/baseSkill";

import { Header } from "~/app/_components/header/header";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Nouvelle compétence de base",
};

export default async function NewSexe() {
  const session = await auth();

  if (!session) {
    notFound();
  }

  const univers = await db.univers
    .findFirstOrThrow({
      where: {
        Users: {
          some: {
            id: session.universId,
          },
        },
      },
    })
    .catch(() => {
      console.log("Univers not found");
      notFound();
    });

  return (
    <HydrateClient>
      <Header back title={`Créer une compétence de base | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <h1 className="text-text mb-4 text-2xl font-bold">
            Créer une compétence de base
          </h1>

          <CreateBaseSkill univers={univers} />
        </div>
      </main>
    </HydrateClient>
  );
}
