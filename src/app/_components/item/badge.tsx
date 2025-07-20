import { type Item, ItemType } from "@prisma/client";

import { ItemTypeDisplay } from "~/lib/models/Item";

import { Badge } from "~/app/_components/ui/badge";

export const ItemBadge: React.FC<{ item: Item }> = ({ item }) => {
  switch (item.type) {
    case ItemType.WEAPON:
      return (
        <Badge className="bg-[#B22222] text-white">
          {ItemTypeDisplay[item.type]}
        </Badge>
      );
    case ItemType.ARMOR:
      return (
        <Badge className="bg-[#708090] text-black">
          {ItemTypeDisplay[item.type]}
        </Badge>
      );
    case ItemType.CONSUMABLE:
      return (
        <Badge className="bg-[#ffa500] text-black">
          {ItemTypeDisplay[item.type]}
        </Badge>
      );
    case ItemType.TOOL:
      return (
        <Badge className="bg-[#8B4513] text-white">
          {ItemTypeDisplay[item.type]}
        </Badge>
      );
    case ItemType.MISC:
      return (
        <Badge className="bg-[#A9A9A9] text-black">
          {ItemTypeDisplay[item.type]}
        </Badge>
      );
    case ItemType.FOOD:
      return (
        <Badge className="bg-[#7CFC00] text-black">
          {ItemTypeDisplay[item.type]}
        </Badge>
      );
    case ItemType.POTION:
      return (
        <Badge className="bg-[#9370DB] text-black">
          {ItemTypeDisplay[item.type]}
        </Badge>
      );
    default:
      return (
        <Badge className="bg-[#d1d5db] text-black">
          {ItemTypeDisplay[item.type] || "Inconnu"}
        </Badge>
      );
  }
};
