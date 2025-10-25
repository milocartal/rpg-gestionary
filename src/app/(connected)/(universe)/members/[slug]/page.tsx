import { forbidden, notFound, unauthorized } from "next/navigation";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";
import { can } from "~/utils/accesscontrol";
import { UpdateUser } from "~/app/_components/user";
import { Header } from "~/app/_components/navigation/header/header";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function MemberUpdate({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (!slug || !can(session).updateAny("user").granted) {
    forbidden();
  }

  const user = await db.user.findUnique({ where: { id: slug } });

  if (!user) {
    notFound();
  }

  return (
    <HydrateClient>
      <Header
        title={`Détails de l'utilisateur ${user.name} | RPG Gestionary`}
      />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 py-10 pt-24">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <UpdateUser user={user} />
        </div>
      </main>
    </HydrateClient>
  );
}
