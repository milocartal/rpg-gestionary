// Error components must be Client Components
import { type Metadata } from "next/types";

import { Link } from "~/app/_components/ui/link";
import { Header } from "~/app/_components/navigation";
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "403 : Accès refusé | RPG Gestionary",
};

export default function Forbidden() {
  return (
    <HydrateClient>
      <Header title="Vous n'êtes pas autorisé" />
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4">
        <section className="bg-background flex flex-col items-center gap-6 rounded-md p-12 shadow">
          <h1 className="text-secondary text-4xl font-bold drop-shadow-xl lg:text-8xl">
            Erreur 403 : Accès refusé
          </h1>
          <p className="text-text text-sm font-medium lg:text-xl">
            Vous n&apos;êtes pas autorisé à accéder à cette page.
          </p>
          <Link
            href="/"
            variant={"accent"}
            className="lg:h-12 lg:rounded-md lg:px-10 lg:text-xl"
          >
            Retourner à la page d&apos;acceuil
          </Link>
        </section>
      </main>
    </HydrateClient>
  );
}
