export default async function ConnectionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative max-h-screen min-h-screen w-full overflow-y-auto">
      {children}
    </main>
  );
}
