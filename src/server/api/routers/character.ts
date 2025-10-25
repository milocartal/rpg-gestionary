import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { CreateCharacterSchema } from "~/app/_components/character/type";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { canInUniverse } from "~/utils/accesscontrol";

export const characterRouter = createTRPCRouter({
  get: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await db.character.findUnique({
      where: { id: input },
    });
  }),

  create: protectedProcedure
    .input(CreateCharacterSchema)
    .mutation(async ({ input, ctx }) => {
      if (!canInUniverse(ctx.session).createOwn("character").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous n'avez pas la permission de créer un personnage",
        });
      }

      const user = await db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Utilisateur non trouvé",
        });
      }

      let counter = 1;

      let slug = `${input.firstName}_${input.name}`
        .toLowerCase()
        .replace(/ /g, "_");

      while (
        await db.character.findUnique({
          where: { slug },
        })
      ) {
        slug = `${input.firstName}_${input.name}_${counter}`
          .toLowerCase()
          .replace(/ /g, "_");
        counter++;
      }

      const character = await db.character.create({
        data: {
          name: input.name,
          firstName: input.firstName,
          age: input.age,
          weight: input.weight,
          height: input.height,
          hp: input.hp,
          image: input.image,
          genderId: input.genderId,
          history: input.history,
          detail: input.detail,
          appearance: input.appearance,
          personality: input.personality,
          populationId: input.populationId,
          storyId: input.storyId,
          slug,
          ownerId: user.id,
          Attributes: {
            createMany: {
              data: input.attributes.map((attribute) => ({
                baseAttributeId: attribute.baseAttributeId,
                value: attribute.value,
              })),
            },
          },
        },
      });

      return character;
    }),

  update: protectedProcedure
    .input(
      CreateCharacterSchema.extend({
        id: z.string().cuid(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!canInUniverse(ctx.session).updateOwn("character").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous n'avez pas la permission de modifier un personnage",
        });
      }

      const user = await db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Utilisateur non trouvé",
        });
      }

      if (
        user.id !== input.userId &&
        !canInUniverse(ctx.session).updateAny("character").granted
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous n'avez pas la permission de modifier ce personnage",
        });
      }

      const character = await db.character.update({
        where: { id: input.id },
        data: {
          ...input,
          Attributes: {
            deleteMany: {},
            createMany: {
              data: input.attributes.map((attribute) => ({
                baseAttributeId: attribute.baseAttributeId,
                value: attribute.value,
              })),
            },
          },
        },
      });

      return character;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!canInUniverse(ctx.session).deleteOwn("character").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous n'avez pas la permission de supprimer un personnage",
        });
      }

      const user = await db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Utilisateur non trouvé",
        });
      }

      if (
        user.id !== input.userId &&
        !canInUniverse(ctx.session).deleteAny("character").granted
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous n'avez pas la permission de supprimer ce personnage",
        });
      }

      return await db.character.delete({
        where: { id: input.id },
      });
    }),

  review: protectedProcedure
    .input(
      z.object({
        characterId: z.string().cuid(),
        review: z.string(),
        isValid: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!canInUniverse(ctx.session).updateAny("character").granted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous n'avez pas la permission de valider un personnage",
        });
      }

      const character = await db.character.findUnique({
        where: { id: input.characterId },
      });

      if (!character) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Personnage non trouvé",
        });
      }

      return await db.character.update({
        where: { id: input.characterId },
        data: {
          isValid: input.isValid,
          notes: input.review,
          reviewedAt: new Date(),
          reviewedById: ctx.session.user.id,
        },
      });
    }),
});
