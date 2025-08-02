import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

import { ResetPassword } from "~/app/_components/connection/reset_password";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <HydrateClient>
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 p-4">
        <ResetPassword email={searchParams.email} />
      </main>
    </HydrateClient>
  );
}
