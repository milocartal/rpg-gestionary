import { forbidden, notFound, unauthorized } from "next/navigation";

import { Header } from "~/app/_components/header/header";
import { Link } from "~/app/_components/ui/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

import { DataTableBaseAttribute } from "~/app/_components/baseAttribute";
import { canInUniverse } from "~/utils/accesscontrol";

export default async function BaseAttributes() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (!session.universeId) {
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

  const baseAttributes = await db.baseAttribute.findMany({
    where: {
      universeId: univers.id,
    },
  });

  return (
    <HydrateClient>
      <Header title={`Attributs de base | ${univers.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <DataTableBaseAttribute data={baseAttributes}>
            {canInUniverse(session).createOwn("base-attribute").granted && (
              <Link href="/attributes/new" className="w-full lg:w-auto">
                Créer un attribut de base
              </Link>
            )}
          </DataTableBaseAttribute>
        </div>
      </main>
    </HydrateClient>
  );
}
