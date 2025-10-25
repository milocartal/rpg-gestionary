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

import { type InviteUserProps } from "./type";

import { inviteUserToUniverseSchema } from "~/lib/models/Univers";

export const InviteUserToUniverse: React.FC<InviteUserProps> = ({
  universeId,
}) => {
  const router = useRouter();

  const inviteUserToUniverse = api.universe.inviteUser.useMutation({
    onSuccess: () => {
      toast.success("Utilisateur invité avec succès !");
      router.push("/members"); // Redirect to the members page after successful invitation
    },
    onError: (error) => {
      console.error("Error inviting user:", error);
      toast.error(
        "Une erreur est survenue lors de l'invitation de l'utilisateur à l'univers.",
      );
    },
  });

  const verifyUser = api.user.verify.useMutation();

  const inviteToPlatform = api.user.invite.useMutation({
    onError: (error) => {
      console.error("Error inviting user to platform:", error);
      toast.error(
        "Une erreur est survenue lors de l'invitation de l'utilisateur à la plateforme.",
      );
    },
  });

  async function onSubmit(values: z.infer<typeof inviteUserToUniverseSchema>) {
    try {
      const { success } = await verifyUser.mutateAsync({
        email: values.userEmail,
      });

      if (!success) {
        // User does not exist, invite to platform first
        await inviteToPlatform.mutateAsync({
          email: values.userEmail,
          role: "default",
          name: values.userEmail,
          image: undefined,
        });
      }

      await inviteUserToUniverse.mutateAsync({
        ...values,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const form = useForm<z.infer<typeof inviteUserToUniverseSchema>>({
    resolver: zodResolver(inviteUserToUniverseSchema),
    defaultValues: {
      universeId: universeId,
      userEmail: "",
      role: "role_player",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-4"
      >
        <Fieldset>
          <FormField
            control={form.control}
            name="userEmail"
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
                    <SelectItem value="spectator">Spectateur</SelectItem>
                    <SelectItem value="role_player">Rôliste</SelectItem>
                    <SelectItem value="game_master">Maître du jeu</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </Fieldset>

        <Button type="submit" className="w-full">
          Inviter un utilisateur
        </Button>
      </form>
    </Form>
  );
};
