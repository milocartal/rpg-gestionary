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
import type { Sexe } from "@prisma/client";

const UpdateSexeSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis"),
});

interface UpdateSexeProps {
  sexe: Sexe;
}

export const UpdateSexe: React.FC<UpdateSexeProps> = ({ sexe }) => {
  const router = useRouter();

  const updateSexe = api.sexe.update.useMutation({
    onSuccess: () => {
      toast.success("Sexe mis à jour avec succès");
      router.push("/sexe");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue " + error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateSexeSchema>) {
    await updateSexe.mutateAsync({
      id: sexe.id,
      name: values.name,
      universId: sexe.universId,
    });
  }

  const form = useForm<z.infer<typeof UpdateSexeSchema>>({
    resolver: zodResolver(UpdateSexeSchema),
    defaultValues: {
      name: sexe.name,
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
          disabled={updateSexe.isPending}
          className="mt-4 self-end"
        >
          {updateSexe.isPending
            ? "Enregistrement..."
            : "Enregistrer les modifications"}
        </Button>
      </form>
    </Form>
  );
};
