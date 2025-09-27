import { type Prisma } from "@prisma/client";
import { z } from "zod";

export type UserWithAll = Prisma.UserGetPayload<{
  include: {
    Universes: true;
    UniversesCreated: true;
    Characters: true;
    Pets: true;
  };
}>;

export type Role = "default" | "admin";

export const RoleDisplay = {
  default: "Utilisateur par défaut",
  admin: "Administrateur",
};

export const RoleEnum = z.enum(["default", "admin"], {
  required_error: "Le rôle est requis",
  invalid_type_error: "Le rôle renseigné n'est pas valide",
});

export const inviteUserSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis")
    .max(64, "Le nom doit faire entre 1 et 64 caractères"),
  email: z
    .string({ required_error: "L'email est requis" })
    .email({ message: "L'email n'est pas valide" })
    .min(1, "L'email est requis"),
  image: z.string().optional(),
  role: RoleEnum,
});

export const createUserSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis")
    .max(64, "Le nom doit faire entre 1 et 64 caractères"),
  email: z
    .string({ required_error: "L'email est requis" })
    .email({ message: "L'email n'est pas valide" })
    .min(1, "L'email est requis"),
  image: z.string().optional(),
  password: z
    .string({ required_error: "Le mot de passe est requis" })
    .min(8, "Le mot de passe doit faire au moins 8 caractères")
    .max(64, "Le mot de passe doit faire entre 8 et 64 caractères"),
});

export const updateUserSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis")
    .max(64, "Le nom doit faire entre 1 et 64 caractères"),
  image: z.string().optional(),
  email: z
    .string({ required_error: "L'email est requis" })
    .email({ message: "L'email n'est pas valide" })
    .min(1, "L'email est requis"),
  role: RoleEnum,
});
