import { z } from "zod";
import { type Universe, type BaseAttribute } from "@prisma/client";

export const CreateBaseAttributeSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis"),
  description: z
    .string({ required_error: "La description est requise" })
    .min(1, "La description est requise"),
});

export interface CreateBaseAttributeProps {
  univers: Universe;
}

export const UpdateBaseAttributeSchema = CreateBaseAttributeSchema.extend({
  id: z.string({ required_error: "L'ID est requis" }),
});

export interface UpdateBaseAttributeProps {
  baseAttribute: BaseAttribute;
}
