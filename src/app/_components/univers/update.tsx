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
import type { Univers } from "@prisma/client";
import { Textarea } from "~/app/_components/ui/textarea";

const UpdateUniversSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis"),
  description: z
    .string({ required_error: "La description est requise" })
    .min(1, "La description est requise"),
});

interface UpdateUniversProps {
  univers: Univers;
}

export const UpdateUnivers: React.FC<UpdateUniversProps> = ({ univers }) => {
  const router = useRouter();

  const updateUnivers = api.univers.update.useMutation({
    onSuccess: () => {
      toast.success("Document créé avec succès");
      router.push("/univers");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue " + error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateUniversSchema>) {
    await updateUnivers.mutateAsync({
      id: univers.id,
      name: values.name,
      description: values.description,
    });
  }

  const form = useForm<z.infer<typeof UpdateUniversSchema>>({
    resolver: zodResolver(UpdateUniversSchema),
    defaultValues: {
      name: univers.name,
      description: univers.description,
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
                Nom de l&apos;univers <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description"
                  className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={updateUnivers.isPending}
          className="mt-4 self-end"
        >
          {updateUnivers.isPending
            ? "Enregistrement..."
            : "Enregistrer les modifications"}
        </Button>
      </form>
    </Form>
  );
};
