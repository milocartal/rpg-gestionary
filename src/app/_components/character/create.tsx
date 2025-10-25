"use client";

import type { BaseAttribute, Class, Gender, Story } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import type { PopulationWithDetailedModifiers } from "~/lib/models/Population";
import { api } from "~/trpc/react";
import { CreateCharacterSchema } from "./type";
import { ImageType } from "~/lib/minio";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ImageInput } from "~/app/_components/image_input";
import { Dnd } from "~/app/_components/dnd";
import { Button } from "~/app/_components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/app/_components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";

import { Input } from "~/app/_components/ui/input";
import { cn } from "~/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Textarea } from "~/app/_components/ui/textarea";

interface CreateCharacterProps {
  attributes: BaseAttribute[];
  populations: PopulationWithDetailedModifiers[];
  stories: Story[];
  genders: Gender[];
  classes: Class[];
}

export const CreateCharacter: React.FC<CreateCharacterProps> = ({
  attributes,
  populations,
  stories,
  genders,
}) => {
  const router = useRouter();
  const ref = useRef<HTMLInputElement | null>(null);

  const [openPopulation, setOpenPopulation] = useState(false);
  const [openStory, setOpenStory] = useState(false);

  const createCharacter = api.character.create.useMutation({
    onMutate: () => {
      toast.loading("Création du personnage en cours...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Personnage créé avec succès !");
      router.push("/characters");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(
        `Erreur lors de la création du personnage : ${error.message}`,
      );
    },
  });

  async function onSubmit(values: z.infer<typeof CreateCharacterSchema>) {
    try {
      if (ref.current?.files?.[0]) {
        const file = ref.current?.files?.[0];

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", ImageType.character);
        const tempImg = await fetch(`/api/image/create`, {
          method: "POST",
          body: formData,
        });
        const img = (await tempImg.json()) as { url: string };
        values.image = img.url;
      }

      await createCharacter.mutateAsync({
        ...values,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const form = useForm<z.infer<typeof CreateCharacterSchema>>({
    resolver: zodResolver(CreateCharacterSchema),
    defaultValues: {
      name: "",
      firstName: "",
      age: 0,
      weight: 0,
      height: 0,
      hp: 0,
      genderId: "",
      history: "",
      detail: "",
      appearance: "",
      personality: "",
      populationId: "",
      storyId: "",
      attributes: attributes.map((attr) => ({
        baseAttributeId: attr.id,
        value: 0,
      })),
    },
  });

  const formPopulation = form.watch("populationId");

  useEffect(() => {
    if (formPopulation) {
      const population = populations.find(
        (population) => population.id === formPopulation,
      );

      if (population) {
        form.setValue("age", population.averageAge ?? 0);
        form.setValue("height", population.averageHeight ?? 0);
        form.setValue("weight", population.averageWeight ?? 0);

        const populationModifiedAttributes = population.Modifiers.filter(
          (mod) => mod.type === "ATTRIBUTE",
        );

        if (populationModifiedAttributes.length > 0) {
          const newAttributes = form
            .getValues("attributes")
            .map((attr) => {
              const modifier = populationModifiedAttributes.find(
                (mod) => mod.baseAttributeId === attr.baseAttributeId,
              );
              if (modifier) {
                return {
                  ...attr,
                  value: attr.value + modifier.value,
                };
              }
              return attr;
            })
            .map((attr) => ({
              ...attr,
              value: Math.max(0, attr.value),
            }));

          form.setValue("attributes", newAttributes);
        }
      }
    }
  }, [formPopulation, populations, form]);

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

        <Fieldset>
          <FormField
            control={form.control}
            name="storyId"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col xl:w-1/3">
                <FormLabel>Histoire</FormLabel>
                <Popover open={openStory} onOpenChange={setOpenStory}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? stories.find((story) => story.id === field.value)
                              ?.name
                          : "Sélectionner une histoire"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Rechercher une histoire..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Aucune histoire trouvée.</CommandEmpty>
                        <CommandGroup>
                          {stories.map((story) => (
                            <CommandItem
                              value={story.name}
                              key={story.id}
                              onSelect={() => {
                                form.setValue("storyId", story.id);
                                setOpenStory(false);
                              }}
                            >
                              {story.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  story.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full xl:w-1/3">
                <FormLabel>
                  Nom <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="DOE" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full xl:w-1/3">
                <FormLabel>
                  Prénom <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Fieldset>

        <Fieldset>
          <FormField
            control={form.control}
            name="populationId"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col xl:w-1/3">
                <FormLabel>Population</FormLabel>
                <Popover open={openPopulation} onOpenChange={setOpenPopulation}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? populations.find(
                              (population) => population.id === field.value,
                            )?.name
                          : "Sélectionner une population"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Rechercher une population..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Aucune population trouvée.</CommandEmpty>
                        <CommandGroup>
                          {populations.map((population) => (
                            <CommandItem
                              value={population.name}
                              key={population.id}
                              onSelect={() => {
                                form.setValue("populationId", population.id);
                                setOpenPopulation(false);
                              }}
                            >
                              {population.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  population.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genderId"
            render={({ field }) => (
              <FormItem className="w-full lg:w-1/3">
                <FormLabel>
                  Genre <span className="text-red-500">*</span>
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
                    {genders.map((gender) => (
                      <SelectItem key={gender.id} value={gender.id}>
                        {gender.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem className="w-full xl:w-1/3">
                <FormLabel>
                  Âge (ans) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="150"
                    type="number"
                    min={0}
                    step={1}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Fieldset>

        <Fieldset>
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem className="w-full xl:w-1/2">
                <FormLabel>
                  Taille (m) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="1.75"
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
            name="weight"
            render={({ field }) => (
              <FormItem className="w-full xl:w-1/2">
                <FormLabel>
                  Masse (kg) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="75"
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
        </Fieldset>

        <FormField
          control={form.control}
          name="history"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Histoire du personnage</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Histoire du personnage, ses origines, son passé..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="appearance"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Apparence du personnage</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Apparence du personnage, ses caractéristiques physiques..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personality"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Personnalité du personnage</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Personnalité du personnage, ses traits de caractère..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detail"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Détails du personnage</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Détails supplémentaires sur le personnage (surnoms, etc...)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Fieldset className="grid grid-cols-2 gap-4 xl:grid-cols-2">
          {form.watch("attributes").map((attribute, index) => {
            const baseAttribute = attributes.find(
              (attr) => attr.id === attribute.baseAttributeId,
            );
            if (!baseAttribute) return null;
            return (
              <FormField
                control={form.control}
                name={`attributes.${index}.value`}
                key={attribute.baseAttributeId}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      {baseAttribute.name} ({baseAttribute.description})
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10"
                        type="number"
                        min={0}
                        step={1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </Fieldset>

        <Fieldset>
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
              "Créer le personnage"
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
          <Button
            type="button"
            variant={"accent"}
            onClick={() => console.log(form.getValues())}
          >
            Afficher les valeurs
          </Button>
        </Fieldset>
      </form>
    </Form>
  );
};
