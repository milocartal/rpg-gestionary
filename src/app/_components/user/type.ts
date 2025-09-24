import type { Session } from "next-auth";
import { type User } from "@prisma/client";

export interface CreateUserProps {
  session: Session | null;
}

export interface UpdateUserProps {
  user: User;
}
