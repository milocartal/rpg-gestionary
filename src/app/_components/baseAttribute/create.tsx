"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

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

import { Textarea } from "~/app/_components/ui/textarea";
import {
  type CreateBaseAttributeProps,
  CreateBaseAttributeSchema,
} from "./type";

export const CreateBaseAttribute: React.FC<CreateBaseAttributeProps> = ({
  univers,
}) => {
  const router = useRouter();

  const createBaseAttribute = api.baseAttribute.create.useMutation({
    onSuccess: () => {
      toast.success("Attribut de base créé avec succès");
      router.push("/attributes");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue " + error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof CreateBaseAttributeSchema>) {
    await createBaseAttribute.mutateAsync({
      universeId: univers.id,
      name: values.name,
      description: values.description,
    });
  }

  const form = useForm<z.infer<typeof CreateBaseAttributeSchema>>({
    resolver: zodResolver(CreateBaseAttributeSchema),
    defaultValues: {
      name: "",
      description: "",
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
                Nom de l&apos;attribut de base{" "}
                <span className="text-red-500">*</span>
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
          disabled={createBaseAttribute.isPending}
          className="mt-4 self-end"
        >
          {createBaseAttribute.isPending
            ? "Création..."
            : "Créer l'attribut de base"}
        </Button>
      </form>
    </Form>
  );
};
