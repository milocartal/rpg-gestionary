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
import { ImageInput } from "~/app/_components/image_input";
import { Dnd } from "~/app/_components/dnd";
import { Suspense, useRef } from "react";
import { ImageType } from "~/lib/minio";
import CustomLexicalEditor from "../lexical/editor";

const CreateUniversSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis"),
  description: z
    .string({ required_error: "La description est requise" })
    .min(1, "La description est requise"),
  banner: z.string().optional(),
});

export const CreateUniverse: React.FC = () => {
  const router = useRouter();
  const ref = useRef<HTMLInputElement | null>(null);

  const createUnivers = api.universe.create.useMutation({
    onSuccess: () => {
      toast.success("Univers créé avec succès");
      router.push("/universes");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue " + error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof CreateUniversSchema>) {
    try {
      if (ref.current?.files?.[0]) {
        const file = ref.current?.files?.[0];

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", ImageType.universe);
        const tempImg = await fetch(`/api/image/create`, {
          method: "POST",
          body: formData,
        });
        const img = (await tempImg.json()) as { url: string };
        values.banner = img.url;
      }

      await createUnivers.mutateAsync({
        name: values.name,
        description: values.description,
        banner: values.banner,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const form = useForm<z.infer<typeof CreateUniversSchema>>({
    resolver: zodResolver(CreateUniversSchema),
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
          name="banner"
          render={() => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="mt-2 mb-1">Image</FormLabel>
              <Dnd>
                <ImageInput dref={ref} />
              </Dnd>
              <FormMessage />
            </FormItem>
          )}
        />
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
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="gap-1">
                Contexte de l&apos;univers
              </FormLabel>
              <Suspense fallback={<div>Chargement de l&apos;éditeur...</div>}>
                <CustomLexicalEditor
                  onChangeJSON={field.onChange}
                  initialContent={field.value}
                  placeholder="Quel est le contexte de votre univers ?"
                />
              </Suspense>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createUnivers.isPending}
          className="mt-4 self-end"
        >
          {createUnivers.isPending ? "Création..." : "Créer l'univers"}
        </Button>
      </form>
    </Form>
  );
};
