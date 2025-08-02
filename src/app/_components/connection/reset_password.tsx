"use client";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Fragment, useRef, useState } from "react";
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

const ResetPasswordSchema = z
  .object({
    email: z
      .string({ required_error: "L'email est requis" })
      .email({ message: "L'email doit être valide" })
      .min(1, "L'email est requis"),
    newPassword: z
      .string({ required_error: "Le mot de passe est requis" })
      .min(8, "Le mot de passe doit faire au moins 8 caractères")
      .max(64, "Le mot de passe doit faire entre 8 et 64 caractères"),
    confirmPassword: z
      .string({ required_error: "La confirmation du mot de passe est requise" })
      .min(
        8,
        "La confirmation du mot de passe doit faire au moins 8 caractères",
      )
      .max(
        64,
        "La confirmation du mot de passe doit faire entre 8 et 64 caractères",
      ),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
  });

export const ResetPassword: React.FC<{ email: string }> = ({ email }) => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  function togglePasswordVisibility() {
    if (passwordRef.current && confirmPasswordRef.current) {
      const type =
        passwordRef.current.type === "password" ? "text" : "password";
      passwordRef.current.type = type;
      confirmPasswordRef.current.type = type;
    }
  }

  const [success, setSuccess] = useState(false);
  const resetPassword = api.user.resetPassword.useMutation({
    onSuccess: () => {
      form.reset();
      setSuccess(true);
    },
    onError: (error) => {
      console.error("Error sending password reset email:", error);
      toast.error("Une erreur est survenue lors de l'envoi de l'email.");
    },
  });

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: email,
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    await resetPassword.mutateAsync(values);
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      {success ? (
        <CardHeader>
          <CardTitle>
            Votre mot de passe a été réinitialisé avec succès
          </CardTitle>
          <CardDescription>
            Vous pouvez maintenant vous connecter avec votre nouveau mot de
            passe.
          </CardDescription>
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
        {success ? (
          <Fragment>
            <p className="text-center">
              Votre mot de passe a été réinitialisé avec succès. Vous pouvez
              maintenant vous connecter avec votre nouveau mot de passe.
            </p>
          </Fragment>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col items-start gap-4"
            >
              {!email && (
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
              )}
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        type="password"
                        {...field}
                        ref={passwordRef}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="link"
                onClick={togglePasswordVisibility}
              >
                Voir le mot de passe
              </Button>

              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        type="password"
                        {...field}
                        ref={confirmPasswordRef}
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
      </CardFooter>
    </Card>
  );
};
