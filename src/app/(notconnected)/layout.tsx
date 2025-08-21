import { auth } from "~/server/auth";
import { PublicHeader, Footer } from "~/app/_components/navigation";

export default async function NotConnectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <main className="relative min-h-screen w-full overflow-x-auto">
      <PublicHeader session={session} />
      {children}
      <Footer session={session} />
    </main>
  );
}
