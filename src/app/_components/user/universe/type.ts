import type { User } from "@prisma/client";

export interface InviteUserProps {
  universeId: string;
}

export interface UpdateUniverseUserProps {
  user: User;
  universeId: string;
}
