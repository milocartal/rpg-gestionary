import type { Metadata } from "next";
import { unauthorized } from "next/navigation";

import { Header } from "~/app/_components/header/header";
import { CreateUniverse } from "~/app/_components/univers/create";
import { auth } from "~/server/auth";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Nouvel univers",
};

export default async function NewUnivers() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  return (
    <HydrateClient>
      <Header back title={"Créer un univers"} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <h1 className="text-text mb-4 text-2xl font-bold">
            Créer un univers
          </h1>

          <CreateUniverse />
        </div>
      </main>
    </HydrateClient>
  );
}
