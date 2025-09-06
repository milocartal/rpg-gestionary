import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Header } from "~/app/_components/navigation";

export default async function Dashboard() {
  const session = await auth();

  return (
    <HydrateClient>
      <Header
        title={`Tableau de bord ${session ? `- ${session.user.name}` : ""}`}
      />
      <main className="relative flex min-h-screen flex-col items-center justify-start gap-12 p-6 pt-24">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow"></div>
      </main>
    </HydrateClient>
  );
}
