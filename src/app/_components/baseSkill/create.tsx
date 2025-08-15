"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

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
import { api } from "~/trpc/react";
import { Input } from "~/app/_components/ui/input";

import { Textarea } from "~/app/_components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";
import React from "react";
import { cn } from "~/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { CreateBaseSkillSchema, type CreateBaseSkillProps } from "./type";

export const CreateBaseSkill: React.FC<CreateBaseSkillProps> = ({
  universe,
  baseAttributes,
}) => {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  const createBaseSkill = api.baseSkill.create.useMutation({
    onSuccess: () => {
      toast.success("Compétence de base créée avec succès");
      router.push("/baseSkill");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue " + error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof CreateBaseSkillSchema>) {
    await createBaseSkill.mutateAsync({
      universeId: universe.id,
      name: values.name,
      description: values.description,
      attributeId: values.attributeId,
    });
  }

  const form = useForm<z.infer<typeof CreateBaseSkillSchema>>({
    resolver: zodResolver(CreateBaseSkillSchema),
    defaultValues: {
      name: "",
      description: "",
      attributeId: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-4 rounded-md bg-white p-4"
      >
        <Fieldset>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Nom de la compétence de base{" "}
                  <span className="text-red-500">*</span>
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
            name="attributeId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Attribut <span className="text-red-500">*</span>
                </FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted",
                        )}
                      >
                        <span className="truncate">
                          {field.value
                            ? baseAttributes.find(
                                (attribute) => attribute.id === field.value,
                              )?.name
                            : "Choisir un attribut de base"}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Chercher un profil..." />
                      <CommandEmpty>
                        Aucun attribut de base trouvable.
                      </CommandEmpty>
                      <CommandList className="max-h-[30vh]">
                        <CommandGroup>
                          {baseAttributes.map((attribute) => (
                            <CommandItem
                              value={attribute.id}
                              key={attribute.id}
                              onSelect={() => {
                                form.setValue("attributeId", attribute.id);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  attribute.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {attribute.name}
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
        </Fieldset>

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
          disabled={createBaseSkill.isPending}
          className="mt-4 self-end"
        >
          {createBaseSkill.isPending
            ? "Création..."
            : "Créer la compétence de base"}
        </Button>
      </form>
    </Form>
  );
};
