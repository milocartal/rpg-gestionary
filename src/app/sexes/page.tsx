import { notFound } from "next/navigation";

import { Header } from "~/app/_components/header/header";
import { Link } from "~/app/_components/ui/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

import { DataTableSexe } from "~/app/_components/sexe";

export default async function Sexes() {
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

  const sexes = await db.sexe.findMany({
    where: {
      universId: session.universId,
    },
  });

  return (
    <HydrateClient>
      <Header title={`Sexes | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <DataTableSexe data={sexes}>
            <Link href="/skills/new" className="w-full lg:w-auto">
              Créer un sexe
            </Link>
          </DataTableSexe>
        </div>
      </main>
    </HydrateClient>
  );
}
