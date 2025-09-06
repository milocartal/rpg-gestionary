import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Header } from "~/app/_components/navigation";

import { forbidden, unauthorized } from "next/navigation";
import { can } from "~/utils/accesscontrol";
import { ContactForm } from "~/app/_components/mail/form";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (!can(session).readAny("admin").granted) {
    forbidden();
  }

  return (
    <HydrateClient>
      <Header title={`Administration du système`} />
      <main className="relative flex min-h-screen flex-col items-center justify-start gap-12 px-4 pt-24 pb-10">
        <section className="bg-primary/1 flex w-full flex-col items-start justify-start gap-4 rounded-md p-6 shadow">
          <h1 className="text-2xl font-bold">
            Bienvenue dans l&apos;administration
          </h1>
          <p className="">Connecté en tant que {session.user.name}</p>
          <ContactForm />
        </section>
      </main>
    </HydrateClient>
  );
}
