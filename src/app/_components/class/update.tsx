"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { Input } from "~/app/_components/ui/input";

import { Textarea } from "~/app/_components/ui/textarea";
import { api } from "~/trpc/react";
import { type UpdateClassProps, UpdateClassSchema } from "./type";
import { Fragment } from "react";

export const UpdateClass: React.FC<UpdateClassProps> = ({
  classObject,
  redirectionSuccess,
}) => {
  const router = useRouter();
  const updateClass = api.class.update.useMutation({
    onSuccess: () => {
      toast.success("Classe mise à jour avec succès");
      if (redirectionSuccess) {
        router.push(redirectionSuccess);
      } else {
        router.push(`/classes`);
      }
    },
    onError: () => {
      toast.error("Échec de la mise à jour de la classe");
    },
  });

  const form = useForm<z.infer<typeof UpdateClassSchema>>({
    resolver: zodResolver(UpdateClassSchema),
    defaultValues: {
      id: classObject.id,
      universeId: classObject.universeId,
      name: classObject.name,
      description: classObject.description,
    },
  });

  const onSubmit = async (values: z.infer<typeof UpdateClassSchema>) => {
    await updateClass.mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la classe</FormLabel>
              <FormControl>
                <Input placeholder="Mage, Barbare, Voleur..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <fieldset className="flex w-full items-center justify-center gap-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-1/2 xl:w-auto"
          >
            {form.formState.isSubmitting ? (
              <Fragment>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Mise à jour...</span>
              </Fragment>
            ) : (
              "Mettre à jour la classe"
            )}
          </Button>
          <Button
            type="reset"
            variant={"outline"}
            onClick={() => {
              form.reset();
            }}
            className="w-1/2 xl:w-auto"
          >
            Réinitialiser
          </Button>
        </fieldset>
      </form>
    </Form>
  );
};
