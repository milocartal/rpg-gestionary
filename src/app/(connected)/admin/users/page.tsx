import { unauthorized } from "next/navigation";

import { Link } from "~/app/_components/ui/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";
import { DataTableUser } from "~/app/_components/user/datatable";
import { Header } from "~/app/_components/navigation/header/header";

export default async function Users() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  const users = await db.user.findMany({
    include: {
      Animals: true,
      Characters: true,
      Universes: true,
      UniversesCreated: true,
    },
  });

  return (
    <HydrateClient>
      <Header title={`Administration des utilisateurs | RPG Gestionary`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 py-10 pt-24">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <DataTableUser data={users}>
            <Link href="/admin/users/new" className="w-full lg:w-auto">
              Créer un utilisateur
            </Link>
          </DataTableUser>
        </div>
      </main>
    </HydrateClient>
  );
}
