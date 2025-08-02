import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Header } from "~/app/_components/header/header";

import { Fragment } from "react";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <Header title={`Bienvenue ${session ? session.user.name : ""}`} />
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 pt-24">
        {session ? (
          <Fragment>
            <p className="">Connecté en tant que {session.user.name}</p>
          </Fragment>
        ) : (
          <Fragment>
            <h1>Veuillez vous connecter ou vous inscrire</h1>
          </Fragment>
        )}
      </main>
    </HydrateClient>
  );
}
