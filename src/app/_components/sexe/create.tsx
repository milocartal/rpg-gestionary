"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
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
import { api } from "~/trpc/react";
import { Input } from "~/app/_components/ui/input";
import type { Univers } from "@prisma/client";

const CreateSexeSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis"),
});

interface CreateSexeProps {
  univers: Univers;
}

export const CreateSexe: React.FC<CreateSexeProps> = ({ univers }) => {
  const router = useRouter();

  const createSexe = api.sexe.create.useMutation({
    onSuccess: () => {
      toast.success("Sexe créé avec succès");
      router.push("/sexe");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue " + error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof CreateSexeSchema>) {
    await createSexe.mutateAsync({
      universId: univers.id,
      name: values.name,
    });
  }

  const form = useForm<z.infer<typeof CreateSexeSchema>>({
    resolver: zodResolver(CreateSexeSchema),
    defaultValues: {
      name: undefined,
    },
  });

  return (
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
                Nom du sexe <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createSexe.isPending}
          className="mt-4 self-end"
        >
          {createSexe.isPending ? "Création..." : "Créer le sexe"}
        </Button>
      </form>
    </Form>
  );
};
