// Error components must be Client Components
import { type Metadata } from "next/types";

import { Link } from "~/app/_components/ui/link";
import { HydrateClient } from "~/trpc/server";
import { SimplifiedHeader } from "./_components/navigation";

export const metadata: Metadata = {
  title: "404 : Page introuvable | RPG Gestionary",
};

export default async function NotFound() {
  return (
    <HydrateClient>
      <SimplifiedHeader title="Page introuvable" back />
      <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4">
        <section className="bg-background flex flex-col items-center gap-6 rounded-md p-12 shadow">
          <h1 className="text-secondary text-4xl font-bold drop-shadow-xl lg:text-8xl">
            Erreur 404
          </h1>
          <p className="text-text text-sm font-medium lg:text-xl">
            La page que vous cherchez n&apos;est pas disponible ou n&apos;existe
            pas.
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
