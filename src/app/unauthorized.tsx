// Error components must be Client Components
import { type Metadata } from "next/types";

import { Header } from "./_components/header/header";
import { HydrateClient } from "~/trpc/server";

import { ConnectionButton } from "~/app/_components/nav/navbar";

export const metadata: Metadata = {
  title: "401 : Vous n'êtes pas autorisé | SAGA",
};

export default function UnauthorizedPage() {
  return (
    <HydrateClient>
      <Header title="Page introuvable" />
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4">
        <section className="bg-background flex flex-col items-center gap-6 rounded-md p-12 shadow">
          <h1 className="text-secondary text-4xl font-bold drop-shadow-xl lg:text-8xl">
            Erreur 401 : Vous n&apos;êtes pas autorisé
          </h1>
          <p className="text-text text-sm font-medium lg:text-xl">
            Vous n&apos;êtes pas autorisé à accéder à cette page. Veuillez vous
            connecter pour accéder à cette ressource.
          </p>
          <ConnectionButton session={null} />
        </section>
      </main>
    </HydrateClient>
  );
}
