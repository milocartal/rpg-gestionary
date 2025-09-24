import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

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
import { SetPassword } from "~/app/_components/connection/new_password";

export const dynamic = "force-dynamic";

//TODO: ajouter la logique pour vérifier le mail: vérifier le token en modifiant la fonction verifyToken pour qu'elle puisse vérifier les tokens de vérification de mail aussi

type Props = {
  params: Promise<{ token: string }>;
};

export default async function VerifyEmailPage({ params }: Props) {
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
                Une erreur est survenue avec le lien de définition du mot de
                passe.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-center">
                Une erreur est survenue avec le lien de définition du mot de
                passe : l&apos;identification de la demande a échoué. Merci de
                contacter le support.
              </p>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Link variant="secondary" href="/register">
                S&apos;inscrire
              </Link>
            </CardFooter>
          </Card>
        </main>
      </HydrateClient>
    );
  }

  const verified = await verifyToken(token, "INVITE");

  if (!verified) {
    return (
      <HydrateClient>
        <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 p-4">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <CardTitle>Une erreur est survenue</CardTitle>
              <CardDescription>
                Une erreur est survenue avec le lien de définition du mot de
                passe.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-center">
                Une erreur est survenue avec le lien de définition du mot de
                passe : la demande n&apos;est pas valide. Merci de contacter le
                support.
              </p>
            </CardContent>

            <CardFooter className="flex justify-between">
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
        <SetPassword token={token} />
      </main>
    </HydrateClient>
  );
}
