import { z } from "zod";

export const CreateCharacterSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, { message: "Le nom doit comporter au moins 1 caractère" }),
  firstName: z
    .string({ required_error: "Le prénom est requis" })
    .min(1, { message: "Le prénom doit comporter au moins 1 caractère" }),
  age: z.coerce
    .number()
    .int({ message: "L'âge doit être un nombre entier" })
    .min(0, { message: "L'âge doit être supérieur ou égal à 0" }),
  weight: z.coerce
    .number()
    .min(0, { message: "Le poids doit être supérieur ou égal à 0" }),
  height: z.coerce
    .number()
    .min(0, { message: "La taille doit être supérieure ou égale à 0" }),
  hp: z.coerce.number().min(0, {
    message: "Les points de vie doivent être supérieurs ou égaux à 0",
  }),
  genderId: z
    .string({ required_error: "Le genre est requis" })
    .min(1, { message: "Le genre doit être sélectionné" }),
  history: z
    .string({ required_error: "L'histoire est requise" })
    .min(1, { message: "L'histoire doit comporter au moins 1 caractère" }),
  detail: z
    .string({ required_error: "Le détail est requis" })
    .min(1, { message: "Le détail doit comporter au moins 1 caractère" }),
  appearance: z
    .string({ required_error: "L'apparence est requise" })
    .min(1, { message: "L'apparence doit comporter au moins 1 caractère" }),
  personality: z
    .string({ required_error: "La personnalité est requise" })
    .min(1, { message: "La personnalité doit comporter au moins 1 caractère" }),
  populationId: z
    .string({ required_error: "La population est requise" })
    .min(1, { message: "La population doit être sélectionnée" }),
  storyId: z
    .string({ required_error: "L'histoire est requise" })
    .min(1, { message: "L'histoire doit être sélectionnée" }),
  skills: z
    .array(
      z.object({
        baseSkillId: z.string({
          required_error: "L'ID de la compétence de base est requis",
        }),
        value: z.coerce.number().int().min(0, {
          message: "Le niveau doit être un nombre entier supérieur ou égal à 0",
        }),
      }),
    )
    .refine(
      (skills) => skills.reduce((acc, skill) => acc + skill.value, 0) <= 100,
      {
        message: "La somme des niveaux de compétence ne doit pas dépasser 100",
      },
    ),
});

export const CharacterSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  firstName: z.string(),
  age: z.number().int(),
  weight: z.number(),
  height: z.number(),
  hp: z.number(),
  genderId: z.string(),
  history: z.string(),
  detail: z.string(),
  appearance: z.string(),
  personality: z.string(),
  populationId: z.string(),
  userId: z.string(),
  storyId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
