import { type Prisma } from "@prisma/client";

export type CharacterWithAll = Prisma.CharacterGetPayload<{
  include: {
    Attributes: true;
    Skills: true;
    Modifiers: true;
    Classes: true;
    Population: true;
    Story: true;
    Pets: true;
    User: true;
  };
}>;
