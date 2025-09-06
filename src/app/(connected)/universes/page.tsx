import { unauthorized } from "next/navigation";

import { Header } from "~/app/_components/navigation";
import { Link } from "~/app/_components/ui/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";
import { DataTableUnivers } from "~/app/_components/univers/datatable";

export const metadata = {
  title: "Liste des univers | RPG Gestionary",
};

export default async function Univers() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  const univers = await db.universe.findMany({
    where: {
      Users: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      Users: true,
      Stories: true,
      Genders: true,
      Species: true,
      Populations: true,
      BaseSkills: true,
    },
  });

  return (
    <HydrateClient>
      <Header title={"Liste des univers | RPG Gestionary"} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <DataTableUnivers data={univers}>
            <Link href="/universes/new" className="w-full lg:w-auto">
              Créer un univers
            </Link>
          </DataTableUnivers>
        </div>
      </main>
    </HydrateClient>
  );
}
