import Navbar from "~/app/_components/navigation/sidebar/sidebar";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { Fragment } from "react";
import { redirect } from "next/navigation";

export default async function ConnectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const univers = await db.universe.findMany({
    where: {
      Users: {
        some: {
          userId: session?.user.id,
        },
      },
    },
    include: {
      Users: true,
    },
  });

  return (
    <Fragment>
      <Navbar session={session} univers={univers} />
      <main className="relative max-h-screen min-h-screen w-full overflow-y-auto">
        {children}
      </main>
    </Fragment>
  );
}
