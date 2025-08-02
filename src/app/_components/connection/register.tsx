"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

import { Input } from "~/app/_components/ui/input";
import { api } from "~/trpc/react";

import { DiscordButton, GitHubButton } from "./button";
import { Separator } from "~/app/_components/ui/separator";
import { useRef } from "react";

const RegisterSchema = z
  .object({
    name: z
      .string({ required_error: "Le nom est requis" })
      .min(1, "Le nom est requis")
      .max(64, "Le nom doit faire entre 1 et 64 caractères"),
    email: z
      .string({ required_error: "L'email est requis" })
      .email({ message: "L'email n'est pas valide" })
      .min(1, "L'email est requis"),
    password: z
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
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
  });

export const RegisterForm: React.FC = () => {
  const router = useRouter();

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      toast.success("Compte créé avec succès !");
      router.push("/login"); // Redirect to the login page after successful sign-up
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      toast.error("Une erreur est survenue lors de la création du compte.");
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    await createUser.mutateAsync({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  }

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

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Inscription</CardTitle>
        <CardDescription>
          Créez un compte pour accéder à toutes les fonctionnalités.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-start gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Nom d&apos;utilisateur{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Milo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="john@doe.io" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
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
              className="w-full"
              variant="outline"
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
              Créer un compte
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-2">
        <DiscordButton />
        <GitHubButton />

        <Separator className="my-1 w-full" />

        <span className="text-sm">Déjà un compte ?</span>
        <Button
          variant="accent"
          size="lg"
          onClick={() => router.push("/login")}
        >
          Se connecter
        </Button>
      </CardFooter>
    </Card>
  );
};
