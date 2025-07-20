import { z } from "zod";
import { ItemTypeZod } from "~/lib/models/Item";

export const CreateItemSchema = z.object({
  name: z.string({ required_error: "Le nom de l'objet est requis" }).min(1, {
    message: "Le nom de l'objet doit contenir au moins 1 caractère",
  }),
  description: z.string().optional(),
  sprite: z.string().optional(),
  weight: z.coerce.number().optional(),
  value: z.coerce.number().optional(),
  isConsumable: z.boolean().optional().default(false),
  public: z.boolean().optional().default(false),
  type: ItemTypeZod,
  universeId: z
    .string({ required_error: "L'ID de l'univers est requis" })
    .min(1, {
      message: "L'ID de l'univers doit contenir au moins 1 caractère",
    }),
});

export const UpdateItemSchema = CreateItemSchema.extend({
  id: z.string({ required_error: "L'ID de l'objet est requis" }).min(1, {
    message: "L'ID de l'objet doit contenir au moins 1 caractère",
  }),
});
