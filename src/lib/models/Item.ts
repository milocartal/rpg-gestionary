import { z } from "zod";
import { ItemType } from "@prisma/client";

export const ItemTypeZod = z.nativeEnum(ItemType);

export const ItemTypeDisplay = {
  [ItemType.MISC]: "Objet divers",
  [ItemType.WEAPON]: "Arme",
  [ItemType.ARMOR]: "Armure",
  [ItemType.POTION]: "Potion",
  [ItemType.FOOD]: "Nourriture",
  [ItemType.CONSUMABLE]: "Consommable",
  [ItemType.TOOL]: "Outil",
};
