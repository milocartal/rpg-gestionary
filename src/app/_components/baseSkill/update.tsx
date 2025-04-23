"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "~/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { api } from "~/trpc/react";
import { modules } from "~/utils/quill";
import { Input } from "~/app/_components/ui/input";
import type { BaseSkill } from "@prisma/client";

const Quill = dynamic(() => import("react-quill"), { ssr: false });

const UpdateBaseSkillSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis"),
  description: z
    .string({ required_error: "La description est requise" })
    .min(1, "La description est requise"),
});

interface UpdateBaseSkillProps {
  baseSkill: BaseSkill;
}

export const UpdateBaseSkill: React.FC<UpdateBaseSkillProps> = ({
  baseSkill,
}) => {
  const router = useRouter();

  const updateBaseSkill = api.baseSkill.update.useMutation({
    onSuccess: () => {
      toast.success("Compétence de base créée mise à jour avec succès");
      router.push("/baseSkill");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue " + error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateBaseSkillSchema>) {
    await updateBaseSkill.mutateAsync({
      id: baseSkill.id,
      universId: baseSkill.universId,
      name: values.name,
      description: values.description,
    });
  }

  const form = useForm<z.infer<typeof UpdateBaseSkillSchema>>({
    resolver: zodResolver(UpdateBaseSkillSchema),
    defaultValues: {
      name: baseSkill.name,
      description: baseSkill.description,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-4 rounded-md bg-white p-4"
      >
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
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Quill
                  theme="snow"
                  modules={modules}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={updateBaseSkill.isPending}
          className="mt-4 self-end"
        >
          {updateBaseSkill.isPending
            ? "Enregistrement..."
            : "Enregistrer les modifications"}
        </Button>
      </form>
    </Form>
  );
};
