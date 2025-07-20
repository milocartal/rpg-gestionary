"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Universe, ItemType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { CreateItemSchema } from "./type";

import { type z } from "zod";
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
import { ImageInput } from "~/app/_components/image_input";
import { Dnd } from "~/app/_components/dnd";
import { useRef } from "react";
import { Input } from "~/app/_components/ui/input";
import { ItemTypeDisplay } from "~/lib/models/Item";
import { Checkbox } from "~/app/_components/ui/checkbox";
import { Textarea } from "~/app/_components/ui/textarea";
import { Button } from "~/app/_components/ui/button";

interface CreateItemProps {
  universe: Universe;
}

export const CreateItem: React.FC<CreateItemProps> = ({ universe }) => {
  const router = useRouter();

  const ref = useRef<HTMLInputElement | null>(null);

  const createItem = api.item.create.useMutation({
    onSuccess: () => {
      toast.success("Object créé avec succès");
      router.push(`/items`);
    },
    onError: (error) => {
      toast.error(`Erreur lors de la création de l'objet : ${error.message}`);
    },
  });

  const form = useForm({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: {
      name: "",
      description: "",
      sprite: undefined,
      weight: undefined,
      value: undefined,
      isConsumable: false,
      public: false,
      type: ItemType.MISC,
      universeId: universe.id,
    },
  });

  async function onSubmit(values: z.infer<typeof CreateItemSchema>) {
    await createItem.mutateAsync(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="sprite"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel className="mb-1">Image</FormLabel>
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
                  Nom de l&apos;objet <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nom de l'objet" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full lg:w-1/2">
                <FormLabel>
                  Type d&apos;objet <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez le type d'objet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ItemType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {ItemTypeDisplay[type]}
                      </SelectItem>
                    ))}
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
            name="weight"
            render={({ field }) => (
              <FormItem className="w-full lg:w-1/2">
                <FormLabel>Poids (en kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Poids de l'objet"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="w-full lg:w-1/2">
                <FormLabel>Valeur</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Valeur de l'objet"
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
            name="isConsumable"
            render={({ field }) => (
              <FormItem className="w-full lg:w-1/2">
                <FormLabel className="hover:bg-secondary/25 has-[[aria-checked=true]]:border-secondary has-[[aria-checked=true]]:bg-secondary/50 dark:has-[[aria-checked=true]]:border-secondary dark:has-[[aria-checked=true]]:bg-secondary/5 flex items-start gap-3 rounded-lg border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:border-secondary data-[state=checked]:bg-secondary/50 dark:data-[state=checked]:border-secondary dark:data-[state=checked]:bg-secondary/50 data-[state=checked]:text-black"
                    />
                  </FormControl>
                  <div className="grid gap-1.5 font-normal">
                    <p className="has text-sm leading-none font-medium">
                      Consomable
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Cochez cette case si l&apos;objet est consommable, comme
                      une potion ou un aliment.
                    </p>
                  </div>
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="public"
            render={({ field }) => (
              <FormItem className="w-full lg:w-1/2">
                <FormLabel className="hover:bg-secondary/25 has-[[aria-checked=true]]:border-secondary has-[[aria-checked=true]]:bg-secondary/50 dark:has-[[aria-checked=true]]:border-secondary dark:has-[[aria-checked=true]]:bg-secondary/5 flex items-start gap-3 rounded-lg border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:border-secondary data-[state=checked]:bg-secondary/50 dark:data-[state=checked]:border-secondary dark:data-[state=checked]:bg-secondary/50 data-[state=checked]:text-black"
                    />
                  </FormControl>
                  <div className="grid gap-1.5 font-normal">
                    <p className="has text-sm leading-none font-medium">
                      Public
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Cochez cette case si l&apos;objet est public et peut être
                      utilisé par tous les joueurs de l&apos;univers.
                    </p>
                  </div>
                </FormLabel>
              </FormItem>
            )}
          />
        </Fieldset>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description de l'objet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Fieldset className="justify-end">
          <Button type="submit" disabled={createItem.isPending}>
            {createItem.isPending ? "Création en cours..." : "Créer l'objet"}
          </Button>
        </Fieldset>
      </form>
    </Form>
  );
};
