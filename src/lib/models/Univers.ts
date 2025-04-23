import { type Prisma } from "@prisma/client";

export type UniversWithAll = Prisma.UniversGetPayload<{
  include: {
    Users: true;
    Stories: true;
    Sexes: true;
    Species: true;
    Populations: true;
    BaseSkills: true;
  };
}>;

export type UniversWithUsers = Prisma.UniversGetPayload<{
  include: {
    Users: true;
  };
}>;
