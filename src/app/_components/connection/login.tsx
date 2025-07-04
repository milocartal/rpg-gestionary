"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { signIn } from "next-auth/react";

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
import { Separator } from "../ui/separator";

const SignInSchema = z.object({
  email: z
    .string({ required_error: "Le nom est requis" })
    .email({ message: "L'email doit être valide" })
    .min(1, "Le nom est requis"),
  password: z
    .string({ required_error: "La description est requise" })
    .min(8, "La description est requise")
    .max(64, "Le mot de passe doit faire entre 8 et 64 caractères"),
});

export const SignIn: React.FC = () => {
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof SignInSchema>) {
    await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    })
      .then((result) => {
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Connexion réussie !");
          router.push("/"); // Redirect to the home page or a specific page after successful sign-in
        }
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
        toast.error("Une erreur est survenue lors de la connexion.");
      });
  }

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <section className="flex w-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Connexion</h1>
      <p className="text-muted-foreground text-sm">
        Veuillez entrer vos identifiants pour vous connecter à votre compte.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-start gap-4 rounded-md bg-white p-4"
        >
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

          <Button type="submit" className="mt-4 self-end">
            Se connecter
          </Button>
        </form>
      </Form>
      <Separator className="my-4 w-full" />
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
