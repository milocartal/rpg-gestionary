import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

import { LoginForm } from "~/app/_components/connection/login";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <HydrateClient>
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 p-4">
        <LoginForm />
      </main>
    </HydrateClient>
  );
}
