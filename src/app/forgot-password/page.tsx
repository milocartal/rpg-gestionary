import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

import { ForgotPassword } from "~/app/_components/connection/forgot_password";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <HydrateClient>
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 p-4">
        <ForgotPassword />
      </main>
    </HydrateClient>
  );
}
