import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

import { ResetPassword } from "~/app/_components/connection/reset_password";
import { redirect } from "next/navigation";
import { verifyToken } from "~/server/auth/password-token";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Link } from "~/app/_components/ui/link";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({ params }: Props) {
  const session = await auth();

  const { token } = await params;

  if (session) {
    redirect("/");
  }

  if (!token || token.length !== 64) {
    return (
      <HydrateClient>
        <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 p-4">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <CardTitle>Une erreur est survenue</CardTitle>
              <CardDescription>
                Une erreur est survenue avec le lien de réinitialisation du mot
                de passe.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-center">
                Une erreur est survenue avec le lien de réinitialisation du mot
                de passe : l&apos;identification de la demande a échoué.
              </p>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Link variant="outline" href="/forgot-password">
                Retour à la réinitialisation du mot de passe
              </Link>
              <Link variant="secondary" href="/register">
                S&apos;inscrire
              </Link>
            </CardFooter>
          </Card>
        </main>
      </HydrateClient>
    );
  }

  const verified = await verifyToken(token, "RESET");

  if (!verified) {
    return (
      <HydrateClient>
        <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 p-4">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <CardTitle>Une erreur est survenue</CardTitle>
              <CardDescription>
                Une erreur est survenue avec le lien de réinitialisation du mot
                de passe.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-center">
                Une erreur est survenue avec le lien de réinitialisation du mot
                de passe : la demande n&apos;est pas valide.
              </p>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Link variant="outline" href="/forgot-password">
                Retour à la réinitialisation du mot de passe
              </Link>
              <Link variant="secondary" href="/register">
                S&apos;inscrire
              </Link>
            </CardFooter>
          </Card>
        </main>
      </HydrateClient>
    );
  }

  return (
    <HydrateClient>
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 p-4">
        <ResetPassword token={token} />
      </main>
    </HydrateClient>
  );
}
