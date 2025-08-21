import type { Metadata } from "next";
import { forbidden, notFound, unauthorized } from "next/navigation";
import { CreateBaseAttribute } from "~/app/_components/baseAttribute";

import { Header } from "~/app/_components/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";
import { canInUniverse } from "~/utils/accesscontrol";

export const metadata: Metadata = {
  title: "Nouvelle compétence de base",
};

export default async function NewBaseAttribute() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (
    !canInUniverse(session).createOwn("base-attribute").granted ||
    !session.universeId
  ) {
    forbidden();
  }

  const universe = await db.universe
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

  return (
    <HydrateClient>
      <Header back title={`Créer une compétence de base | ${universe.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <h1 className="text-text mb-4 text-2xl font-bold">
            Créer une compétence de base
          </h1>

          <CreateBaseAttribute univers={universe} />
        </div>
      </main>
    </HydrateClient>
  );
}
