import { notFound } from "next/navigation";

import { Header } from "~/app/_components/header/header";
import { Link } from "~/app/_components/ui/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

import { DataTableBaseSkill } from "~/app/_components/baseSkill";

export default async function BaseSkills() {
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

  const baseSkills = await db.baseSkill.findMany({
    where: {
      universId: session.universId,
    },
  });

  return (
    <HydrateClient>
      <Header title={`Compétences de base | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <DataTableBaseSkill data={baseSkills}>
            <Link href="/skills/new" className="w-full lg:w-auto">
              Créer une compétence de base
            </Link>
          </DataTableBaseSkill>
        </div>
      </main>
    </HydrateClient>
  );
}
