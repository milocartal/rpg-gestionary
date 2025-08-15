import type { BaseAttribute, BaseSkill, Universe } from "@prisma/client";
import { z } from "zod";

const CreateBaseSkillSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis"),
  description: z
    .string({ required_error: "La description est requise" })
    .min(1, "La description est requise"),
  attributeId: z
    .string({ required_error: "L'attribut est requis" })
    .min(1, "L'attribut est requis"),
});

const UpdateBaseSkillSchema = CreateBaseSkillSchema.extend({
  id: z.string(),
});

interface CreateBaseSkillProps {
  universe: Universe;
  baseAttributes: BaseAttribute[];
}
interface UpdateBaseSkillProps {
  baseSkill: BaseSkill;
  baseAttributes: BaseAttribute[];
}

export {
  type CreateBaseSkillProps,
  type UpdateBaseSkillProps,
  CreateBaseSkillSchema,
  UpdateBaseSkillSchema,
};
