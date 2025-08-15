"use client";

import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { Fragment } from "react";

const schemaContact = z.object({
  email: z
    .string({ required_error: "Email requis" })
    .email({ message: "Email invalide" }),
  subject: z
    .string({ required_error: "Sujet requis" })
    .min(2, { message: "Le sujet doit contenir au moins 2 caractères." })
    .max(100, { message: "Le sujet doit contenir entre 2 et 100 caractères." }),
  message: z
    .string({ required_error: "Message requis" })
    .min(2, { message: "Le message doit contenir au moins 2 caractères." })
    .max(1000, {
      message: "Le message doit contenir entre 2 et 1000 caractères.",
    }),
});

export const ContactForm = () => {
  const sendMail = api.mail.sendMail.useMutation({
    onSuccess: () => {
      // Handle success (e.g., show a success message)
      toast.success("Email envoyé avec succès !");
      form.reset();
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error("Error sending email:", error);
      toast.error("Échec de l'envoi de l'email");
    },
  });

  const form = useForm<z.infer<typeof schemaContact>>({
    resolver: zodResolver(schemaContact),
    defaultValues: {
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: z.infer<typeof schemaContact>) {
    await sendMail.mutateAsync({
      to: data.email,
      subject: data.subject,
      text: data.message,
      html: `<p>${data.message}</p>`,
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 bg-gray-100"
      >
        <h2 className="text-lg font-semibold">
          Formulaire d&apos;envoi de mail
        </h2>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email du destinataire</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sujet</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Sujet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={sendMail.isPending}>
          {sendMail.isPending ? (
            <Fragment>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </Fragment>
          ) : (
            "Envoyer"
          )}
        </Button>
      </form>
    </Form>
  );
};
