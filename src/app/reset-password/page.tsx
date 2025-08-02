import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

import { ResetPassword } from "~/app/_components/connection/reset_password";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  const email = (await searchParams)?.email as string | undefined;

  return (
    <HydrateClient>
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 p-4">
        <ResetPassword email={email} />
      </main>
    </HydrateClient>
  );
}
