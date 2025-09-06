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
import { Textarea } from "~/app/_components/ui/textarea";
import { ImageInput } from "~/app/_components/image_input";
import { Dnd } from "~/app/_components/dnd";
import { useRef } from "react";
import { ImageType } from "~/lib/minio";

const CreateStorySchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis"),
  description: z
    .string({ required_error: "La description est requise" })
    .min(1, "La description est requise"),
  banner: z.string().optional(),
  universeId: z.string(),
});

export const CreateStory: React.FC<{ universeId: string }> = ({
  universeId,
}) => {
  const router = useRouter();
  const ref = useRef<HTMLInputElement | null>(null);

  const createStory = api.story.create.useMutation({
    onSuccess: () => {
      toast.success("Histoire créé avec succès");
      router.push("/stories");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue " + error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof CreateStorySchema>) {
    try {
      if (ref.current?.files?.[0]) {
        const file = ref.current?.files?.[0];

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", ImageType.story);
        const tempImg = await fetch(`/api/image/create`, {
          method: "POST",
          body: formData,
        });
        const img = (await tempImg.json()) as { url: string };
        values.banner = img.url;
      }

      await createStory.mutateAsync({
        name: values.name,
        description: values.description,
        banner: values.banner,
        universeId: values.universeId,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const form = useForm<z.infer<typeof CreateStorySchema>>({
    resolver: zodResolver(CreateStorySchema),
    defaultValues: {
      name: "",
      description: "",
      universeId: universeId,
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
                Nom de l&apos;histoire <span className="text-red-500">*</span>
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
          disabled={createStory.isPending}
          className="mt-4 self-end"
        >
          {createStory.isPending ? "Création..." : "Créer l'univers"}
        </Button>
      </form>
    </Form>
  );
};
