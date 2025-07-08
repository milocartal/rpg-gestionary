import { type Prisma } from "@prisma/client";

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
