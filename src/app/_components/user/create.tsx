"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "~/app/_components/ui/button";
import {
  Fieldset,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";

import { Input } from "~/app/_components/ui/input";
import { api } from "~/trpc/react";

import { useRef } from "react";

import { can } from "~/utils/accesscontrol";
import { type CreateUserProps } from "./type";
import { inviteUserSchema, type Role } from "~/lib/models/User";
import { Dnd } from "~/app/_components/dnd";
import { ImageType } from "~/lib/minio";
import { ImageInput } from "~/app/_components/image_input";

export const CreateUser: React.FC<CreateUserProps> = ({ session }) => {
  const router = useRouter();
  const ref = useRef<HTMLInputElement | null>(null);

  const createUser = api.user.invite.useMutation({
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

  async function onSubmit(values: z.infer<typeof inviteUserSchema>) {
    try {
      if (ref.current?.files?.[0]) {
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

      await createUser.mutateAsync({
        ...values,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const form = useForm<z.infer<typeof inviteUserSchema>>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      name: "",
      email: "",
      image: undefined,
      role: "default" as Role,
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

        <Fieldset>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full lg:w-1/2">
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
            name="role"
            render={({ field }) => (
              <FormItem className="w-full lg:w-1/2">
                <FormLabel>
                  Rôle <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez un rôle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="default">
                      Utilisateur par défaut
                    </SelectItem>
                    {can(session).createAny("admin").granted && (
                      <SelectItem value="admin">Administrateur</SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </Fieldset>

        <Fieldset>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full lg:w-3/6">
                <FormLabel>
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="john@doe.io" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Fieldset>

        <Button type="submit" className="w-full">
          Créer un utilisateur
        </Button>
      </form>
    </Form>
  );
};
