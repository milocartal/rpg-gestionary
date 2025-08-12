import type { Prisma } from "@prisma/client";

export type PopulationWithModifiers = Prisma.PopulationGetPayload<{
  include: {
    Modifiers: true;
  };
}>;

export type PopulationWithDetailedModifiers = Prisma.PopulationGetPayload<{
  include: {
    Modifiers: {
      include: {
        BaseAttribute: true;
        BaseSkill: true;
      };
    };
  };
}>;
