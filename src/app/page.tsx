import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Header } from "~/app/_components/header/header";

import { SignIn } from "~/app/_components/connection/login";
import { Register } from "~/app/_components/connection/register";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <Header title={`Bienvenue ${session ? session.user.name : ""}`} />
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 pt-24">
        {session ? (
          <p className="">Connecté en tant que {session.user.name}</p>
        ) : (
          <section className="flex w-full items-center justify-center gap-4">
            <SignIn />
            <Register />
          </section>
        )}
      </main>
    </HydrateClient>
  );
}
