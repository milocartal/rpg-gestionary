"use client";

import { type Universe } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Pencil } from "lucide-react";
import { type Session } from "next-auth";

import { Link as ShadLink } from "~/app/_components/ui/link";
import { Separator } from "~/app/_components/ui/separator";
import { useIsMobile } from "~/hooks/use-mobile";
import { canInUniverse } from "~/utils/accesscontrol";
import { withSessionProvider } from "~/utils/withSessionProvider";

interface UniversResumeProps {
  univers: Universe;
  species: number;
  populations: number;
  animals: number;
  characters: number;
  stories: number;
  readonly session: Session | null;
}

const UniversResumeOne: React.FC<UniversResumeProps> = ({
  univers,
  species,
  populations,
  animals,
  characters,
  stories,
  session,
}) => {
  const isMobile = useIsMobile();
  return (
    <section className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-6 shadow">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-text mb-4 text-2xl font-bold">
          Aperçu de l&apos;univers
        </h2>

        {canInUniverse(session).updateOwn("univers").granted && (
          <ShadLink
            href={`/universes/${univers.slug}/edit`}
            size={isMobile ? "icon" : "default"}
          >
            {isMobile ? <Pencil className="h-6 w-6" /> : "Modifier"}
          </ShadLink>
        )}
      </div>
      <div className="flex flex-col items-center">
        <aside className="flex flex-col gap-3">
          <h3 className="text-text mb-1 w-full text-center text-xl font-semibold lg:text-start">
            {univers.name}
          </h3>
          <p className="text-muted-foreground text-sm">{univers.description}</p>
          <div className="flex flex-col items-center gap-3 lg:flex-row">
            <p>
              Créé le {format(univers.createdAt, "dd/MM/yyyy", { locale: fr })}
            </p>
            <Separator orientation="vertical" className="hidden h-6 lg:block" />
            <p>
              Dernière mise à jour le{" "}
              {format(univers.updatedAt, "dd/MM/yyyy", { locale: fr })}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 lg:flex-row">
            <p>{species} espèces</p>
            <Separator orientation="vertical" className="hidden h-6 lg:block" />
            <p>{populations} populations</p>
            <Separator orientation="vertical" className="hidden h-6 lg:block" />
            <p>{stories} histoires</p>
            <Separator orientation="vertical" className="hidden h-6 lg:block" />
            <p>{animals} animaux</p>
            <Separator orientation="vertical" className="hidden h-6 lg:block" />
            <p>{characters} personnages</p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export const UniversResume = withSessionProvider(UniversResumeOne);
