import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UniverseWithUsers } from "./models/Univers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function toSlug(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
