import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Header } from "~/app/_components/header/header";
import { ConnectionTab } from "~/app/_components/connection/tabs";
import { redirect } from "next/navigation";

export default async function Connection({
  searchParams,
}: Readonly<{
  searchParams: Record<string, string | string[] | undefined>;
}>) {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  let tab = (searchParams?.tab as string | undefined) ?? undefined;
  if (tab && tab !== "login" && tab !== "register") {
    tab = "login"; // Default to login if the tab is not recognized
  }

  return (
    <HydrateClient>
      <Header title={`Bienvenue sur SAGA. Connectez-vous ou inscrivez-vous`} />
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 pt-24">
        <ConnectionTab defaultTab={tab} />
      </main>
    </HydrateClient>
  );
}
