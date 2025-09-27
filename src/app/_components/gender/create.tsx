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
import { api } from "~/trpc/react";
import { Input } from "~/app/_components/ui/input";
import type { Universe } from "@prisma/client";

const CreateGenderSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis"),
});

interface CreateGenderProps {
  univers: Universe;
}

export const CreateGender: React.FC<CreateGenderProps> = ({ univers }) => {
  const router = useRouter();

  const createGender = api.gender.create.useMutation({
    onSuccess: () => {
      toast.success("Genre créé avec succès");
      router.push("/genders");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue " + error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof CreateGenderSchema>) {
    await createGender.mutateAsync({
      universeId: univers.id,
      name: values.name,
    });
  }

  const form = useForm<z.infer<typeof CreateGenderSchema>>({
    resolver: zodResolver(CreateGenderSchema),
    defaultValues: {
      name: "",
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
                Nom du gender <span className="text-red-500">*</span>
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
          disabled={createGender.isPending}
          className="mt-4 self-end"
        >
          {createGender.isPending ? "Création..." : "Créer le genre"}
        </Button>
      </form>
    </Form>
  );
};
