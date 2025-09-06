"use client";

import { type Species } from "@prisma/client";

import { Pencil } from "lucide-react";
import { type Session } from "next-auth";

import { Link as ShadLink } from "~/app/_components/ui/link";
import { useIsMobile } from "~/hooks/use-mobile";
import { canInUniverse } from "~/utils/accesscontrol";
import { withSessionProvider } from "~/utils/withSessionProvider";

interface SpeciesResumeProps {
  species: Species;
  readonly session: Session | null;
}

const SpeciesResumeOne: React.FC<SpeciesResumeProps> = ({
  species,
  session,
}) => {
  const isMobile = useIsMobile();
  return (
    <section className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-6 shadow">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-text mb-4 text-2xl font-bold">
          Aperçu de la species
        </h2>

        {canInUniverse(session).updateOwn("species").granted && (
          <ShadLink
            href={`/species/${species.slug}/edit`}
            size={isMobile ? "icon" : "default"}
          >
            {isMobile ? <Pencil className="h-6 w-6" /> : "Modifier"}
          </ShadLink>
        )}
      </div>
      <div className="flex flex-col items-center">
        <aside className="flex flex-col gap-3">
          <h3 className="text-text mb-1 w-full text-center text-xl font-semibold lg:text-start">
            {species.name}
          </h3>
          <p className="text-muted-foreground text-sm">{species.description}</p>
          <p>Espérance de vie: {species.averageAge}</p>
          <p>Taille maximale: {species.maxHeight}</p>
          <p>Taille minimale: {species.minHeight}</p>
          <p>Masse maximale: {species.maxWeight}</p>
          <p>Masse minimale: {species.minWeight}</p>
        </aside>
      </div>
    </section>
  );
};

export const SpeciesResume = withSessionProvider(SpeciesResumeOne);
