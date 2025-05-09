import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Header } from "~/app/_components/header/header";
import { CreatePopulation } from "~/app/_components/population/create";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Nouvel population",
};

export default async function NewPopulation() {
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
      <Header back title={"Créer un population"} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <h1 className="text-text mb-4 text-2xl font-bold">
            Créer un population
          </h1>

          <CreatePopulation univers={univers} />
        </div>
      </main>
    </HydrateClient>
  );
}
