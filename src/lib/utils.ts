import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UniverseWithUsers } from "./models/Univers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate et retourne le rôle d'un utilisateur dans un univers.
 *
 * Recherche l'utilisateur dans la liste des utilisateurs de l'univers fourni via son ID,
 * et détermine son rôle en fonction de la chaîne de rôle. La priorité des rôles est la suivante :
 * "maitre-du-jeu", "gestionnaire", "roliste", "spectateur".
 * Si l'utilisateur n'est pas trouvé ou n'a aucun rôle correspondant, retourne "anonyme".
 *
 * @param univers - L'objet univers contenant les utilisateurs et leurs rôles.
 * @param userId - L'identifiant de l'utilisateur dont le rôle doit être formaté.
 * @returns Le rôle formaté sous forme de chaîne.
 */
export function formatUniverseRole(
  univers: UniverseWithUsers,
  userId: string | null | undefined,
): string {
  const user = univers.Users.find((temp) => temp.userId === userId);

  let role = "anonyme";
  if (!user) return role;

  if (user.role.includes("spectateur")) role = "spectateur";
  if (user.role.includes("roliste")) role = "roliste";
  if (user.role.includes("gestionnaire")) role = "gestionnaire";
  if (user.role.includes("maitre-du-jeu")) role = "maitre-du-jeu";

  return role;
}

/**
 * Retourne une classe Tailwind CSS pour la couleur de bordure selon le rôle de l'utilisateur dans l'univers donné.
 *
 * @param univers - L'objet univers contenant les rôles des utilisateurs.
 * @param userId - L'identifiant de l'utilisateur dont le rôle doit être déterminé.
 * @returns Une chaîne représentant la classe Tailwind CSS pour la couleur de bordure selon le rôle de l'utilisateur.
 *
 * - "maitre-du-jeu" : bordure rouge
 * - "gestionnaire" : bordure orange
 * - "roliste" : bordure verte
 * - "spectateur" : bordure bleue
 * - tout autre rôle : bordure grise
 */
export function SwitchBorderColor(
  univers: UniverseWithUsers,
  userId: string | null | undefined,
): string {
  const role = formatUniverseRole(univers, userId);

  switch (role) {
    case "maitre-du-jeu":
      return "border-[#FC6254]";
    case "gestionnaire":
      return "border-[#FF7C50]";
    case "roliste":
      return "border-[#5EA880]";
    case "spectateur":
      return "border-[#5E80A8]";
    default:
      return "border-[#B4B4B4]";
  }
}

export function lancerDes(nbDe: number, nbFaces: number): number[] {
  const result = [];
  for (let i = 0; i < nbDe; i++) {
    result.push(Math.floor(Math.random() * nbFaces) + 1);
  }
  return result;
}

export function sommeDes(nbDe: number, nbFaces: number): number {
  const result = lancerDes(nbDe, nbFaces);
  return result.reduce((acc, val) => acc + val, 0);
}

export function lancerDesAvecModificateur(
  nbDe: number,
  nbFaces: number,
  modificateur: number,
): number {
  const result = lancerDes(nbDe, nbFaces);
  return result.reduce((acc, val) => acc + val, modificateur);
}

export function sommeDesAvecModificateur(
  nbDe: number,
  nbFaces: number,
  modificateur: number,
): number {
  const result = lancerDes(nbDe, nbFaces);
  return result.reduce((acc, val) => acc + val, modificateur);
}

/**
 * Convertit une chaîne de caractères en un slug compatible avec les URLs.
 *
 * La fonction normalise la chaîne, supprime les diacritiques, la met en minuscules,
 * remplace les caractères non alphanumériques par des tirets et retire les tirets en début/fin.
 *
 * @param name - La chaîne à convertir en slug.
 * @returns La version slugifiée de la chaîne d'entrée.
 */
export function toSlug(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Génère une valeur de repli ("fallback") à partir d'un nom donné.
 *
 * - Si le nom est nul, indéfini ou vide, retourne "RPG".
 * - Si le nom contient un seul mot, retourne ce mot avec la première lettre en majuscule.
 * - Si le nom contient plusieurs mots, conserve uniquement le premier et le dernier mot,
 *   puis retourne ces mots avec la première lettre en majuscule, séparés par un espace.
 *
 * @param name Le nom à transformer en valeur de repli.
 * @returns La valeur de repli formatée.
 */
export function toFallback(name: string | null | undefined) {
  if (!name || name.trim() === "") {
    return "RPG";
  }

  const words = name.split(" ");
  if (words.length === 0) {
    return "RPG";
  } else if (words.length === 1) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  } else {
    if (words.length > 2) {
      words.splice(1, words.length - 2);
    }
    const fallbackWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1),
    );
    return fallbackWords.join(" ");
  }
}

/**
 * Convertit une chaîne HTML en texte brut avec retours à la ligne.
 * - Supprime <script> / <style>
 * - Insère \n pour les balises de bloc et <br>
 * - Décode les entités HTML courantes (&nbsp;, &amp;, &lt; ...)
 * - Écrase les espaces multiples et normalise les sauts de ligne
 */
export function htmlToPlainText(html: string): string {
  if (!html) return "";

  // 1) Nettoyage préliminaire
  let s = html
    // enlever scripts / styles
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");

  // 2) Si on est côté navigateur, on profite du DOM pour un rendu fidèle
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const el = document.createElement("div");
    el.innerHTML = s;
    // innerText respecte mieux les sauts de ligne que textContent
    const text = el.innerText.replace(/\u00A0/g, " "); // &nbsp;
    return normalizeWhitespace(text);
  }

  // 3) Fallback Node.js (regex simple mais efficace)
  // 3.1: <br> -> \n
  s = s.replace(/<(br)\s*\/?>/gi, "\n");

  // 3.2: Balises de bloc -> \n
  const blockTags = [
    "address",
    "article",
    "aside",
    "blockquote",
    "canvas",
    "dd",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hr",
    "li",
    "main",
    "nav",
    "noscript",
    "ol",
    "output",
    "p",
    "pre",
    "section",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "td",
    "th",
    "ul",
    "video",
  ];
  const blockRe = new RegExp(`</?(${blockTags.join("|")})\\b[^>]*>`, "gi");
  s = s.replace(blockRe, "\n");

  // 3.3: Supprimer le reste des balises
  s = s.replace(/<[^>]+>/g, "");

  // 3.4: Décoder les entités HTML (numériques + quelques nommées)
  // &#123; (décimal)
  s = s.replace(/&#(\d+);/g, (_, dec: string) =>
    String.fromCodePoint(parseInt(dec, 10)),
  );
  // &#x1F60A; (hexadécimal)
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
    String.fromCodePoint(parseInt(hex, 16)),
  );
  // Entités nommées de base
  const entities: Record<string, string> = {
    nbsp: " ",
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
  };
  s = s.replace(/&([a-zA-Z]+);/g, (_, name: string) =>
    Object.prototype.hasOwnProperty.call(entities, name)
      ? (entities[name] ?? "")
      : "",
  );

  return normalizeWhitespace(s);
}

// Petite aide pour normaliser les espaces et sauts de ligne
function normalizeWhitespace(input: string): string {
  return (
    input
      // remplace suites d'espaces (incl. \t, \f, \v, nbsp) par un espace
      .replace(/[ \t\f\v\u00A0]+/g, " ")
      // supprime les espaces en début/fin de ligne
      .split("\n")
      .map((l) => l.trim())
      .join("\n")
      // compacte les suites de 3+ lignes vides en 2
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}
