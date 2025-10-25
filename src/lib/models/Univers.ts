import { type Prisma } from "@prisma/client";
import { z } from "zod";

export type UniverseWithAll = Prisma.UniverseGetPayload<{
  include: {
    Users: true;
    Stories: true;
    Genders: true;
    Species: true;
    Populations: true;
    BaseSkills: true;
  };
}>;

export type UniverseWithUsers = Prisma.UniverseGetPayload<{
  include: {
    Users: true;
  };
}>;

export type UserToUniverseWithUniverse = Prisma.UserToUniverseGetPayload<{
  include: {
    Universe: true;
  };
}>;

export type UniverseRole = "spectator" | "role_player" | "game_master";

export const UniverseRoleDisplay = {
  spectator: "Spectateur",
  role_player: "Rôliste",
  game_master: "Maître du jeu",
};

export const UniverseRoleEnum = z.enum(
  ["spectator", "role_player", "game_master"],
  {
    required_error: "Le rôle est requis",
    invalid_type_error: "Le rôle renseigné n'est pas valide",
  },
);

export const inviteUserToUniverseSchema = z.object({
  universeId: z
    .string({ required_error: "L'univers est requis" })
    .min(1, "L'univers est requis"),
  userEmail: z
    .string({ required_error: "L'email est requis" })
    .email({ message: "L'email n'est pas valide" })
    .min(1, "L'email est requis"),
  image: z.string().optional(),
  role: UniverseRoleEnum,
});

export const updateUniverseUserSchema = z.object({
  universeId: z
    .string({ required_error: "L'univers est requis" })
    .min(1, "L'univers est requis"),
  userId: z
    .string({ required_error: "L'utilisateur est requis" })
    .min(1, "L'utilisateur est requis"),
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis")
    .max(64, "Le nom doit faire entre 1 et 64 caractères"),
  role: UniverseRoleEnum,
});
