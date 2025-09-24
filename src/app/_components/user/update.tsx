"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "~/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";

import { Input } from "~/app/_components/ui/input";
import { api } from "~/trpc/react";

import { useRef } from "react";

import { type UpdateUserProps } from "./type";
import { updateUserSchema, type Role } from "~/lib/models/User";
import { ImageType } from "~/lib/minio";
import { ImageInput } from "~/app/_components/image_input";
import { Dnd } from "~/app/_components/dnd";

export const UpdateUser: React.FC<UpdateUserProps> = ({ user }) => {
  const router = useRouter();
  const ref = useRef<HTMLInputElement | null>(null);

  const { data: verification } = api.user.verifyOrigin.useQuery({
    id: user.id,
  });

  const updateUser = api.user.update.useMutation({
    onSuccess: () => {
      toast.success("Compte créé avec succès !");
      router.push("/admin/users"); // Redirect to the users page after successful creation
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      toast.error(
        "Une erreur est survenue lors de la création de l'utilisateur.",
      );
    },
  });

  async function onSubmit(values: z.infer<typeof updateUserSchema>) {
    try {
      if (ref.current?.files?.[0]) {
        if (
          user.image?.includes("rpg") &&
          !user.image?.includes("placeholder")
        ) {
          const DelFormData = new FormData();
          DelFormData.append("imageUrl", user.image);
          await fetch(`/api/image/delete`, {
            method: "POST",
            body: DelFormData,
          });
        }

        const file = ref.current?.files?.[0];

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", ImageType.species);
        const tempImg = await fetch(`/api/image/create`, {
          method: "POST",
          body: formData,
        });
        const img = (await tempImg.json()) as { url: string };
        values.image = img.url;
      }

      await updateUser.mutateAsync({
        id: user.id,
        ...values,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name!,
      email: user.email!,
      image: user.image ?? undefined,
      role: user.role as Role,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-4"
      >
        <FormField
          control={form.control}
          name="image"
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
                Nom d&apos;utilisateur <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Milo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Email <span className="text-red-500">*</span>
              </FormLabel>
              {verification?.isOAuthUser && (
                <FormDescription>
                  Cet utilisateur s&apos;est inscrit via un fournisseur externe
                  ({verification.origins.join(", ")}). La modification de son
                  email peut l&apos;empêcher de se connecter.
                </FormDescription>
              )}
              <FormControl>
                <Input
                  placeholder="john@doe.io"
                  type="email"
                  {...field}
                  disabled={verification?.isOAuthUser}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Créer un utilisateur
        </Button>
      </form>
    </Form>
  );
};
