import Image from "next/image";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Header } from "~/app/_components/header/header";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <Header title={`Bienvenue ${session ? session.user.name : ""}`} />
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 pt-24">
        <Image src="/monogramme.svg" alt="logo" width={500} height={500} />
        {session ? (
          <p className="">Connecté en tant que {session.user.name}</p>
        ) : (
          <p className="">Non connecté</p>
        )}
      </main>
    </HydrateClient>
  );
}
