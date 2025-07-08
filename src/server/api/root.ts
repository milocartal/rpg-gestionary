import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { animalRouter } from "./routers/animal";
import { attributeRouter } from "./routers/attribute";
import { baseAttributeRouter } from "./routers/base_attribute";
import { baseSkillRouter } from "./routers/base_skill";
import { characterRouter } from "./routers/character";
import { populationRouter } from "./routers/population";
import { genderRouter } from "./routers/gender";
import { skillRouter } from "./routers/skill";
import { speciesRouter } from "./routers/species";
import { storyRouter } from "./routers/story";
import { universeRouter } from "./routers/univers";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  animal: animalRouter,
  attribute: attributeRouter,
  baseAttribute: baseAttributeRouter,
  baseSkill: baseSkillRouter,
  character: characterRouter,
  population: populationRouter,
  gender: genderRouter,
  skill: skillRouter,
  species: speciesRouter,
  story: storyRouter,
  universe: universeRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
