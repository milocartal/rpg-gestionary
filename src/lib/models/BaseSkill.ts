import type { Prisma } from "@prisma/client";

export type BaseSkillWithUnivers = Prisma.BaseSkillGetPayload<{
  include: {
    Univers: true;
  };
}>;
