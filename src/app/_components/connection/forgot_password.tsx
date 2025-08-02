"use client";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "~/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { api } from "~/trpc/react";
import { Link } from "~/app/_components/ui/link";
import { Input } from "~/app/_components/ui/input";

const ForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .email({ message: "L'email doit être valide" })
    .min(1, "L'email est requis"),
});

interface ForgotPasswordResult {
  status: number;
  code: string;
  cause: string;
  message: string;
}

export const ForgotPassword: React.FC = () => {
  const forgotPassword = api.user.forgotPassword.useMutation({
    onSuccess: () => {
      form.reset();
    },
    onError: (error) => {
      console.error("Error sending password reset email:", error);
      toast.error("Une erreur est survenue lors de l'envoi de l'email.");
    },
  });

  const [result, setResult] = useState<ForgotPasswordResult | null>(null);

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
    const data = await forgotPassword.mutateAsync(values);
    setResult(data);
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      {result ? (
        <CardHeader>
          <CardTitle>
            {result.status === 200
              ? "Email envoyé !"
              : "Un problème est survenu."}
          </CardTitle>
        </CardHeader>
      ) : (
        <CardHeader>
          <CardTitle>Réinitialiser le mot de passe</CardTitle>
          <CardDescription>
            Entrez votre adresse email pour recevoir un lien de réinitialisation
            du mot de passe.
          </CardDescription>
        </CardHeader>
      )}

      <CardContent>
        {result ? (
          <Fragment>
            <p className="text-center">{result.message}</p>
          </Fragment>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col items-start gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Votre email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Réinitialiser le mot de passe
              </Button>
            </form>
          </Form>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Link variant="outline" href="/login">
          Retour à la connexion
        </Link>
        <Link variant="secondary" href="/register">
          S&apos;inscrire
        </Link>
      </CardFooter>
    </Card>
  );
};
