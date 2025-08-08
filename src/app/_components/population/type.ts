import type { Population, Universe } from "@prisma/client";
import { z } from "zod";

interface CreatePopulationProps {
  univers: Universe;
  redirectionSuccess?: string;
}

interface UpdatePopulationProps {
  population: Population;
  redirectionSuccess?: string;
}

const CreatePopulationSchema = z.object({
  image: z.string().optional(),
  name: z
    .string()
    .min(1, { message: "The name of the population is required" }),
  description: z.string().min(1, { message: "The description is required" }),
  averageAge: z.coerce
    .number({ required_error: "The average lifespan is required" })
    .min(1, { message: "The average lifespan must be greater than 1" }),
  averageHeight: z.coerce
    .number({ required_error: "The average height is required" })
    .min(0, { message: "The average height must be greater than 0" }),
  averageWeight: z.coerce
    .number({ required_error: "The average weight is required" })
    .min(1, { message: "The average weight must be greater than 1" }),
  universeId: z.string({ required_error: "The universeId is required" }),
});

const UpdatePopulationSchema = CreatePopulationSchema.extend({
  id: z.string({ required_error: "The id is required" }),
});

export type { CreatePopulationProps, UpdatePopulationProps };
export { CreatePopulationSchema, UpdatePopulationSchema };
