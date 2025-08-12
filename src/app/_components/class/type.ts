import type { Class, Universe } from "@prisma/client";

import { z } from "zod";

export interface CreateClassProps {
  universe: Universe;
}

export const CreateClassSchema = z.object({
  universeId: z.string(),
  name: z.string().min(2).max(100),
  description: z.string().max(500),
});

export interface UpdateClassProps {
  classObject: Class;
  redirectionSuccess?: string;
}

export const UpdateClassSchema = CreateClassSchema.extend({
  id: z.string(),
});
