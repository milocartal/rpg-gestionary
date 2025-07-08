import type { Species, Universe } from "@prisma/client";
import { z } from "zod";

interface CreateSpeciesProps {
  univers: Universe;
  redirectionSuccess?: string;
}

interface UpdateSpeciesProps {
  species: Species;
  redirectionSuccess?: string;
}

const CreateSpeciesSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(1, { message: "The name of the species is required" }),
  description: z.string().min(1, { message: "The description is required" }),
  averageAge: z
    .number({ required_error: "The average lifespan is required" })
    .min(1, { message: "The average lifespan must be greater than 1" }),
  maxHeight: z
    .number({ required_error: "The maximum height is required" })
    .min(0, { message: "The maximum height must be greater than 0" }),
  minHeight: z
    .number({ required_error: "The minimum height is required" })
    .min(0, { message: "The minimum height must be greater than 0" }),
  maxWeight: z
    .number({ message: "The maximum weight is required" })
    .min(0, { message: "The maximum weight must be greater than 0" }),
  minWeight: z
    .number({ message: "The minimum weight is required" })
    .min(0, { message: "The minimum weight must be greater than 0" }),
  universeId: z.string({ required_error: "The universeId is required" }),
});

const UpdateSpeciesSchema = CreateSpeciesSchema.extend({
  id: z.string({ required_error: "The id is required" }),
});

export type { CreateSpeciesProps, UpdateSpeciesProps };
export { CreateSpeciesSchema, UpdateSpeciesSchema };
