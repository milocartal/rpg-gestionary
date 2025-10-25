import { AccessControl, type Query } from "accesscontrol";
import type { Session } from "next-auth";

export const ac = new AccessControl();

export const acUnivers = new AccessControl();

//Anonyme
ac.grant("anonyme");

//Utilisateur
ac.grant("default")
  .extend("anonyme")
  .readOwn("user")
  .updateOwn("user")
  .deleteOwn("user")
  .createOwn("univers")
  .updateOwn("univers")
  .deleteOwn("univers")
  .readAny("univers");

//Admin
ac.grant("administrateur")
  .extend("default")
  .readAny("admin")
  .readAny("user")
  .createAny("user")
  .updateAny("user")
  .deleteAny("user")
  .readAny("univers")
  .createAny("univers")
  .updateAny("univers")
  .deleteAny("univers")
  .createAny("mail");

//Spectator
acUnivers
  .grant("spectator")
  .readAny("spectator")
  .readAny("species")
  .readAny("population")
  .readAny("story")
  .readAny("class");

//Roliste
acUnivers
  .grant("role_player")
  .extend("spectator")
  .readAny("role_player")
  .readOwn("character")
  .createOwn("character")
  .updateOwn("character")
  .deleteOwn("character")
  .readOwn("companion")
  .createOwn("companion")
  .updateOwn("companion")
  .deleteOwn("companion")
  .readOwn("skill")
  .createOwn("skill")
  .updateOwn("skill")
  .deleteOwn("skill");

//Maitre du jeu
acUnivers
  .grant("game_master")
  .extend("role_player")
  .readAny("game_master")
  .createAny("invite")
  .readAny("character")
  .createAny("character")
  .updateAny("character")
  .deleteAny("character")
  .readAny("companion")
  .createAny("companion")
  .updateAny("companion")
  .deleteAny("companion")
  .readOwn("univers")
  .updateOwn("univers")
  .deleteOwn("univers")
  .createOwn("story")
  .updateOwn("story")
  .deleteOwn("story")
  .readAny("story")
  .createAny("species")
  .updateAny("species")
  .deleteAny("species")
  .createAny("item")
  .updateAny("item")
  .deleteAny("item")
  .readAny("population")
  .createAny("population")
  .updateAny("population")
  .deleteAny("population")
  .createAny("gender")
  .updateAny("gender")
  .deleteAny("gender")
  .createAny("base-skill")
  .updateAny("base-skill")
  .deleteAny("base-skill")
  .createAny("base-attribute")
  .updateAny("base-attribute")
  .deleteAny("base-attribute")
  .createAny("class")
  .updateAny("class")
  .deleteAny("class")
  .readAny("event")
  .createAny("event")
  .updateAny("event")
  .deleteAny("event")
  .readAny("story")
  .createAny("story")
  .updateAny("story")
  .deleteAny("story")
  .createAny("review");

export function can(session: Session | null): Query {
  //console.log("session can", session);
  let role = "anonyme";
  if (!session) return ac.can(role);

  if (session.user.role.includes("default")) role = "default";
  if (session.user.role.includes("admin")) role = "administrateur";

  return ac.can(role);
}

export function canInUniverse(session: Session | null): Query {
  //console.log("session canInUniverse", session);
  let role = "spectator";
  if (!session) return acUnivers.can(role);

  if (!session.Univers) {
    role = "spectator";
    return acUnivers.can(role);
  }

  if (session.Univers.role.includes("spectator")) role = "spectator";
  if (session.Univers.role.includes("role_player")) role = "role_player";
  if (session.Univers.role.includes("gestionnaire")) role = "game_master";
  if (session.Univers.role.includes("game_master")) role = "game_master";

  return acUnivers.can(role);
}

export const GlobalRoles: string[] = ["anonyme", "default", "administrateur"];

export const UniversRoles: string[] = [
  "spectator",
  "role_player",
  "game_master",
];

export enum GlobalRolesEnum {
  ANONYMOUS = "anonyme",
  DEFAULT = "default",
  ADMIN = "administrateur",
}

export enum UniversRolesEnum {
  SPECTATOR = "spectator",
  ROLIST = "role_player",
  GAME_MASTER = "game_master",
}

/**
 * Format a role string by capitalizing the first letter of each word and
 * joining words with a space.
 *
 * @param role The role string to format
 * @returns A formatted role string
 * @example
 * formatRole("aidant-particulier") // "Aidant-Particulier"
 */
export function formatRole(role: string) {
  return role
    .split("-")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * Normalize a role string by converting it to lowercase and removing any
 * diacritics (accents, umlauts, etc.).
 *
 * @param role The role string to normalize
 * @returns A normalized role string
 * @example
 * normalizeRole("Aidant-Particuli r") // "aidant-particulier"
 */
export function normalizeRole(role: string) {
  return role
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
