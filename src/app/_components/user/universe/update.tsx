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

import { type UpdateUniverseUserProps } from "./type";
import {
  updateUniverseUserSchema,
  type UniverseRole,
} from "~/lib/models/Univers";

export const UpdateUser: React.FC<UpdateUniverseUserProps> = ({
  user,
  universeId,
}) => {
  const router = useRouter();

  const updateUser = api.universe.updateUser.useMutation({
    onSuccess: () => {
      toast.success("Utilisateur mis à jour");
      router.push("/members"); // Redirect to the members page after successful creation
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      toast.error(
        "Une erreur est survenue lors de la mise à jour de l'utilisateur.",
      );
    },
  });

  async function onSubmit(values: z.infer<typeof updateUniverseUserSchema>) {
    try {
      await updateUser.mutateAsync({
        ...values,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const form = useForm<z.infer<typeof updateUniverseUserSchema>>({
    resolver: zodResolver(updateUniverseUserSchema),
    defaultValues: {
      universeId: universeId,
      userId: user.id,
      name: user.name!,
      role: user.role as UniverseRole,
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
          name="role"
          render={({ field }) => (
            <FormItem className="w-full lg:w-1/2">
              <FormLabel>
                Rôle <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="spectator">Spectateur</SelectItem>
                  <SelectItem value="role_player">Rôliste</SelectItem>
                  <SelectItem value="game_master">Maître du jeu</SelectItem>
                </SelectContent>
              </Select>

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
