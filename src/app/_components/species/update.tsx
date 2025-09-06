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

import { type UpdateSpeciesProps, UpdateSpeciesSchema } from "./type";
import { Dnd } from "~/app/_components/dnd";
import { ImageType } from "~/lib/minio";

export const UpdateSpecies: React.FC<UpdateSpeciesProps> = ({
  redirectionSuccess,
  species,
}) => {
  const router = useRouter();
  const ref = useRef<HTMLInputElement | null>(null);

  const updateSpecies = api.species.update.useMutation({
    onMutate: () => {
      toast.loading("Mise à jour de l'espèce en cours...");
    },
    onSuccess: () => {
      form.reset();
      toast.success("Espèce mise à jour avec succès");
      router.refresh();

      if (redirectionSuccess) {
        router.push(redirectionSuccess);
      } else {
        router.push("/species");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue " + error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateSpeciesSchema>) {
    try {
      if (ref.current?.files?.[0]) {
        if (
          species.image?.includes("rpg") &&
          !species.image?.includes("placeholder")
        ) {
          const DelFormData = new FormData();
          DelFormData.append("imageUrl", species.image);
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

      await updateSpecies.mutateAsync({
        ...values,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const form = useForm<z.infer<typeof UpdateSpeciesSchema>>({
    defaultValues: {
      name: species.name,
      image: species.image ?? undefined,
      universeId: species.universeId,
      description: species.description,
      averageAge: species.averageAge,
      maxHeight: species.maxHeight,
      minHeight: species.minHeight,
      maxWeight: species.maxWeight,
      minWeight: species.minWeight,
    },
    resolver: zodResolver(UpdateSpeciesSchema),
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
            <FormItem className="flex w-full flex-col">
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
                  Nom de l&apos;espèce <span className="text-red-500">*</span>
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
                    placeholder="40"
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
              <FormItem className="w-full xl:w-1/2">
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
              <FormItem className="w-full xl:w-1/2">
                <FormLabel>
                  Taille maximum (m) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="3"
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
              <FormItem className="w-full xl:w-1/2">
                <FormLabel>
                  Masse minimum (kg) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="5"
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
              <FormItem className="w-full xl:w-1/2">
                <FormLabel>
                  Masse maximum (kg) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="1OO"
                    {...field}
                    type="number"
                    step={0.01}
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
                <span>Enregistrement...</span>
              </Fragment>
            ) : (
              "Enregistrer les modifications"
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
