import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

import { RegisterForm } from "~/app/_components/connection/register";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <HydrateClient>
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 p-4">
        <RegisterForm />
      </main>
    </HydrateClient>
  );
}
