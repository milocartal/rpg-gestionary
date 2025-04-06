import { AccessControl, type Query } from "accesscontrol";
import type { Session } from "next-auth";

export const ac = new AccessControl();

//Anonyme
ac.grant("anonyme")
  .readAny("legal")
  .readAny("review")
  .readAny("profile")

  .readAny("categorie")
  .readAny("service")

  .readAny("company");

//default
ac.grant("default")
  .readAny("default")
  .readAny("legal")

  .createOwn("user")
  .readOwn("user")
  .updateOwn("user")
  .deleteOwn("user")

  .createOwn("profile")
  .readOwn("profile")
  .updateOwn("profile")
  .deleteOwn("profile")

  .readAny("company")

  .readAny("categorie")
  .readAny("service")
  .readAny("prestation")
  .readAny("event")

  .readOwn("notification")
  .updateOwn("notification")
  .deleteOwn("notification")

  .readAny("address")
  .createOwn("address")
  .updateOwn("address")
  .deleteOwn("address")

  .readOwn("rib")
  .createOwn("rib")
  .updateOwn("rib")
  .deleteOwn("rib");

//aidant-particulier
ac.grant("aidant-particulier")
  .extend("default")

  .readAny("aidant-particulier")

  .readOwn("family")

  .readOwn("contract")
  .createOwn("contract")
  .updateOwn("contract")

  .readAny("file")

  .readOwn("conversation")
  .updateOwn("conversation")

  .createOwn("message")
  .updateOwn("message")
  .deleteOwn("message")

  .readAny("message")
  .readAny("validation")

  .readAny("service")
  .readAny("prestation")

  .createOwn("review")
  .updateOwn("review")
  .deleteOwn("review");

//particulier-employeur
ac.grant("particulier-employeur")
  .extend("aidant-particulier")

  .readAny("particulier-employeur");

//salarie-particulier
ac.grant("salarie-particulier")
  .extend("default")

  .readAny("salarie-particulier")

  .createOwn("prestation")
  .updateOwn("prestation")
  .deleteOwn("prestation")

  .createOwn("event")
  .updateOwn("event")

  .readAny("validation")

  .createOwn("validation")
  .updateOwn("validation")
  .deleteOwn("validation")

  .readOwn("contract")
  .createOwn("contract")
  .updateOwn("contract")

  .readAny("file")
  .createAny("file")
  .updateAny("file")
  .deleteAny("file")

  .readOwn("conversation")
  .updateOwn("conversation")

  .createOwn("message")
  .updateOwn("message")
  .deleteOwn("message")

  .readAny("message")
  .readAny("validation");

//Salarié
ac.grant("salarie")
  .extend("default")
  .readAny("salarie")

  .readOwn("contract")

  .readAny("categorie")
  .readAny("service")
  .readAny("prestation")

  .readAny("file")
  .createAny("file")
  .updateAny("file")
  .deleteAny("file")

  .readOwn("notification")
  .updateOwn("notification")
  .deleteOwn("notification")

  .readOwn("conversation")
  .updateOwn("conversation")

  .readAny("message")

  .createOwn("message")
  .updateOwn("message")
  .deleteOwn("message")

  .readAny("validation")

  .createOwn("validation")
  .updateOwn("validation")
  .deleteOwn("validation");

//professionnel
ac.grant("professionnel")
  .extend("salarie")
  .readAny("professionnel")

  .updateOwn("profile")
  .deleteOwn("profile")

  .createOwn("prestation")
  .updateOwn("prestation")
  .deleteOwn("prestation")

  .readAny("validation")

  .createOwn("validation")
  .updateOwn("validation")
  .deleteOwn("validation");

//Entreprise
ac.grant("entreprise")
  .extend("professionnel")
  .readAny("entreprise")

  .updateOwn("company")
  .deleteOwn("company")

  .createOwn("contract")
  .updateOwn("contract")
  .deleteOwn("contract")

  .createOwn("facture")
  .updateOwn("facture")
  .deleteOwn("facture")

  .updateOwn("contract-status")

  .createOwn("service-contract")
  .updateOwn("service-contract")

  .createOwn("event")
  .updateOwn("event")
  .deleteOwn("event")

  .updateAny("validation")
  .deleteAny("validation")

  .createOwn("categorie")
  .updateOwn("categorie")
  .deleteOwn("categorie")

  .createOwn("service")
  .updateOwn("service")
  .deleteOwn("service")

  .createOwn("prestation")
  .updateOwn("prestation")
  .deleteOwn("prestation")

  .readAny("conversation")
  .createAny("conversation")
  .updateAny("conversation")

  .createOwn("user")
  .updateOwn("user")
  .deleteOwn("user")

  .updateAny("profile")

  .readAny("rib");

//Admin
ac.grant("administrateur")
  .extend("entreprise")
  .readAny("admin")

  .readAny("user")
  .createAny("user")
  .updateAny("user")
  .deleteAny("user")

  .readAny("profile")
  .createAny("profile")
  .updateAny("profile")
  .deleteAny("profile")

  .readAny("prestation")
  .createAny("prestation")
  .updateAny("prestation")
  .deleteAny("prestation")

  .readAny("service")
  .createAny("service")
  .updateAny("service")
  .deleteAny("service")

  .readAny("categorie")
  .createAny("categorie")
  .updateAny("categorie")
  .deleteAny("categorie")

  .readAny("contract")
  .createAny("contract")
  .updateAny("contract")
  .deleteAny("contract")

  .createAny("service-contract")
  .updateAny("service-contract")

  .readAny("event")
  .createAny("event")
  .updateAny("event")
  .deleteAny("event")

  .readAny("company")
  .createAny("company")
  .updateAny("company")
  .deleteAny("company")

  .readAny("file")
  .createAny("file")
  .updateAny("file")
  .deleteAny("file")

  .createAny("facture")
  .updateAny("facture")
  .deleteAny("facture")

  .readAny("legal")
  .createAny("legal")
  .updateAny("legal")
  .deleteAny("legal")

  .readAny("notification")
  .createAny("notification")
  .updateAny("notification")
  .deleteAny("notification")

  .readAny("message")
  .createAny("message")
  .updateAny("message")
  .deleteAny("message")

  .readAny("conversation")
  .createAny("conversation")
  .updateAny("conversation")
  .deleteAny("conversation")

  .readAny("validation")
  .createAny("validation")
  .updateAny("validation")
  .deleteAny("validation")

  .createAny("address")
  .updateAny("address")
  .deleteAny("address")

  .createAny("rib")
  .updateAny("rib")
  .deleteAny("rib")

  .readAny("field")
  .updateAny("field")

  .updateAny("profile-role")
  .updateAny("contract-status");

export function can(session: Session | null): Query {
  let role = "anonyme";
  if (!session) return ac.can(role);

  if (session.user.role.includes("default")) role = "default";
  if (session.user.role.includes("admin")) role = "administrateur";

  return ac.can(role);
}

export function canInUnivers(session: Session | null): Query {
  let role = "anonyme";
  if (!session) return ac.can(role);

  if (session.univers.role.includes("spectateur")) role = "spectateur";
  if (session.univers.role.includes("roliste")) role = "roliste";
  if (session.univers.role.includes("gestionnaire")) role = "gestionnaire";
  if (session.univers.role.includes("maitre-du-jeu")) role = "maitre-du-jeu";

  return ac.can(role);
}

export const GlobalRoles: string[] = ["anonyme", "default", "administrateur"];

export const UniversRoles: string[] = [
  "spectateur",
  "roliste",
  "gestionnaire",
  "maitre-du-jeu",
];

export enum GlobalRolesEnum {
  ANONYMOUS = "anonyme",
  DEFAULT = "default",
  ADMIN = "administrateur",
}

export enum UniversRolesEnum {
  SPECTATOR = "spectateur",
  ROLIST = "roliste",
  MANAGER = "gestionnaire",
  GAME_MASTER = "maitre-du-jeu",
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
