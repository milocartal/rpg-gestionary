import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UniversWithUsers } from "./models/Univers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUniversRole(
  univers: UniversWithUsers,
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
  univers: UniversWithUsers,
  userId: string | null | undefined,
): string {
  const role = formatUniversRole(univers, userId);

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
