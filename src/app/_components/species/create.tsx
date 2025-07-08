"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

import { ImageInput } from "~/app/_components/image_input";
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

import { type CreateSpeciesProps, CreateSpeciesSchema } from "./type";
import { Dnd } from "~/app/_components/dnd";

export const CreateSpecies: React.FC<CreateSpeciesProps> = ({
  redirectionSuccess,
  univers,
}) => {
  const router = useRouter();
  const ref = useRef<HTMLInputElement | null>(null);

  const createSpecies = api.species.create.useMutation({
    onMutate: () => {
      toast.loading("Création de l'espèce en cours...");
    },
    onSuccess: () => {
      form.reset();
      toast.success("Espèce ajoutée avec succès");
      router.refresh();

      if (redirectionSuccess) {
        router.push(redirectionSuccess);
      } else {
        router.push("/speciess");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue " + error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof CreateSpeciesSchema>) {
    try {
      /* if (ref.current?.files?.[0]) {
        const file = ref.current?.files?.[0];

        const formData = new FormData();
        formData.append("image", file);
        const tempImg = await fetch(`/api/image/create`, {
          method: "POST",
          body: formData,
        });
        const img = (await tempImg.json()) as { url: string };
        values.image = img.url;
      } */

      await createSpecies.mutateAsync({
        ...values,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const form = useForm<z.infer<typeof CreateSpeciesSchema>>({
    defaultValues: {
      name: "",
      image: undefined,
      universeId: univers.id,
      description: "",
      averageAge: 0,
      maxHeight: 0,
      minHeight: 0,
      maxWeight: 0,
      minWeight: 0,
    },
    resolver: zodResolver(CreateSpeciesSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel className="mt-2 mb-1">Image</FormLabel>
              <Dnd>
                <ImageInput dref={ref} />
              </Dnd>
              <FormMessage />
            </FormItem>
          )}
        />

        <fieldset className="flex w-full flex-col gap-4 xl:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full xl:w-1/2">
                <FormLabel>
                  Nom de la species <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Entretien ménager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="averageAge"
            render={({ field }) => (
              <FormItem className="w-full xl:w-1/2">
                <FormLabel>
                  Éspérance de vie moyenne{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="300"
                    type="number"
                    min={0}
                    step={0.01}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <fieldset className="flex w-full flex-col gap-4 xl:flex-row">
          <FormField
            control={form.control}
            name="minHeight"
            render={({ field }) => (
              <FormItem className="w-full xl:w-1/4">
                <FormLabel>
                  Taille minimum (m) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="1.5"
                    type="number"
                    min={0}
                    step={0.1}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxHeight"
            render={({ field }) => (
              <FormItem className="w-full xl:w-1/4">
                <FormLabel>
                  Taille maximum (m) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="100"
                    {...field}
                    type="number"
                    step={0.1}
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <fieldset className="flex w-full flex-col gap-4 xl:flex-row">
          <FormField
            control={form.control}
            name="minWeight"
            render={({ field }) => (
              <FormItem className="w-full xl:w-1/4">
                <FormLabel>
                  Taille moyenne (m) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="1.5"
                    type="number"
                    min={0}
                    step={0.01}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxWeight"
            render={({ field }) => (
              <FormItem className="w-full xl:w-1/4">
                <FormLabel>
                  Masse moyenne (kg) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="1OO"
                    {...field}
                    type="number"
                    step={0.1}
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description de la species" {...field} />
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
                <span>En cours...</span>
              </Fragment>
            ) : (
              "Créer l'espèce"
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
