"use client";

import { Fragment } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/app/_components/ui/carousel";
import type { UserToUniverseWithUniverse } from "~/lib/models/Univers";
import { CustomLexicalReadOnly } from "../lexical/display";

interface UniversesListProps {
  universes: UserToUniverseWithUniverse[];
}

export const UniversesList: React.FC<UniversesListProps> = ({ universes }) => {
  return (
    <Fragment>
      {universes.length === 0 ? (
        <p>
          Vous n&apos;avez pas encore d&apos;univers. Créez-en un pour commencer
          !
        </p>
      ) : (
        <Carousel className="w-full px-12">
          <CarouselContent>
            {universes.map(({ Universe }) => (
              <CarouselItem
                key={Universe.id}
                className="flex w-full basis-1/3 flex-col items-center justify-center"
              >
                <div className="flex w-full flex-col items-start justify-center rounded-lg border p-4 shadow-sm">
                  <h3 className="mb-2 text-lg font-semibold">
                    {Universe.name}
                  </h3>
                  {Universe.description ? (
                    <CustomLexicalReadOnly
                      initialContent={Universe.description ?? undefined}
                    />
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Aucune description disponible pour cet univers.
                    </p>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2">
            Précédent
          </CarouselPrevious>
          <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2">
            Suivant
          </CarouselNext>
        </Carousel>
      )}
    </Fragment>
  );
};
