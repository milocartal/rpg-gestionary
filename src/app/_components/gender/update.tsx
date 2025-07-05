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
import type { Gender } from "@prisma/client";

const UpdateGenderSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis"),
});

interface UpdateGenderProps {
  gender: Gender;
}

export const UpdateGender: React.FC<UpdateGenderProps> = ({ gender }) => {
  const router = useRouter();

  const updateGender = api.gender.update.useMutation({
    onSuccess: () => {
      toast.success("Gender mis à jour avec succès");
      router.push("/gender");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue " + error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateGenderSchema>) {
    await updateGender.mutateAsync({
      id: gender.id,
      name: values.name,
      universId: gender.universId,
    });
  }

  const form = useForm<z.infer<typeof UpdateGenderSchema>>({
    resolver: zodResolver(UpdateGenderSchema),
    defaultValues: {
      name: gender.name,
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
          disabled={updateGender.isPending}
          className="mt-4 self-end"
        >
          {updateGender.isPending
            ? "Enregistrement..."
            : "Enregistrer les modifications"}
        </Button>
      </form>
    </Form>
  );
};
