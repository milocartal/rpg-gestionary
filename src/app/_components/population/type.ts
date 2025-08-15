import type { Population, Universe } from "@prisma/client";
import { z } from "zod";

interface CreatePopulationProps {
  univers: Universe;
  redirectionSuccess?: string;
}

interface UpdatePopulationProps {
  population: Population;
  redirectionSuccess?: string;
}

const CreatePopulationSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(1, { message: "Le nom de la population est requis" }),
  description: z.string().min(1, { message: "La description est requise" }),
  averageAge: z.coerce
    .number({ required_error: "L'espérance de vie est requise" })
    .min(1, { message: "L'espérance de vie doit être supérieure à 1" }),
  averageHeight: z.coerce
    .number({ required_error: "La taille moyenne est requise" })
    .min(0, { message: "La taille moyenne doit être supérieure à 0" }),
  averageWeight: z.coerce
    .number({ required_error: "La masse moyenne est requise" })
    .min(1, { message: "La masse moyenne doit être supérieure à 1" }),
  universeId: z.string({
    required_error: "L'identifiant de l'univers est requis",
  }),
});

const UpdatePopulationSchema = CreatePopulationSchema.extend({
  id: z.string({ required_error: "L'identifiant est requis" }),
});

export type { CreatePopulationProps, UpdatePopulationProps };
export { CreatePopulationSchema, UpdatePopulationSchema };
