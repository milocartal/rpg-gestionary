import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Header } from "~/app/_components/navigation";
import { unauthorized } from "next/navigation";
import { db } from "~/server/db";

export default async function Account() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    unauthorized();
  }

  return (
    <HydrateClient>
      <Header title={`Compte ${user.name}`} />
      <main className="relative flex min-h-screen flex-col items-center justify-start gap-12 p-6 pt-24">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <h2 className="text-lg font-bold">Mes informations</h2>
          <p className="text-sm">Nom: {user.name}</p>
          <p className="text-sm">Email: {user.email}</p>
        </div>
      </main>
    </HydrateClient>
  );
}
