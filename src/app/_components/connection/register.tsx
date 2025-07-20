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

import { Input } from "~/app/_components/ui/input";
import { api } from "~/trpc/react";
import { Separator } from "~/app/_components/ui/separator";
import { signIn } from "next-auth/react";

const RegisterSchema = z
  .object({
    name: z
      .string({ required_error: "Le nom est requis" })
      .min(1, "Le nom est requis")
      .max(64, "Le nom doit faire entre 1 et 64 caractères"),
    email: z
      .string({ required_error: "Le nom est requis" })
      .email({ message: "L'email doit être valide" })
      .min(1, "Le nom est requis"),
    password: z
      .string({ required_error: "La description est requise" })
      .min(8, "La description est requise")
      .max(64, "Le mot de passe doit faire entre 8 et 64 caractères"),
    confirmPassword: z
      .string({ required_error: "La confirmation du mot de passe est requise" })
      .min(8, "La confirmation du mot de passe est requise")
      .max(
        64,
        "La confirmation du mot de passe doit faire entre 8 et 64 caractères",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
  });

export const Register: React.FC = () => {
  const router = useRouter();

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      toast.success("Compte créé avec succès !");
      router.push("/connection"); // Redirect to the connection page after successful sign-up
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
    <section className="flex w-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <p className="text-muted-foreground text-sm">
        Veuillez remplir les informations ci-dessous pour créer un compte.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-start gap-4 rounded-md bg-white p-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Nom d&apos;utilisateur <span className="text-red-500">*</span>
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
                  <Input placeholder="******" type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input placeholder="******" type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-4 self-end">
            Créer un compte
          </Button>
        </form>
      </Form>
      <Separator className="my-4 w-full" />
      <p className="text-muted-foreground text-sm">Ou avec</p>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          void signIn("discord");
        }}
      >
        Discord
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          void signIn("github");
        }}
      >
        GitHub
      </Button>
    </section>
  );
};
