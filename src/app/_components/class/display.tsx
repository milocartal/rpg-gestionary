"use client";

import { type Class } from "@prisma/client";

import { Pencil } from "lucide-react";
import { type Session } from "next-auth";

import { Link as ShadLink } from "~/app/_components/ui/link";
import { useIsMobile } from "~/hooks/use-mobile";
import { canInUniverse } from "~/utils/accesscontrol";
import { withSessionProvider } from "~/utils/withSessionProvider";

interface ClassResumeProps {
  classData: Class;
  readonly session: Session | null;
}

const ClassResumeOne: React.FC<ClassResumeProps> = ({ classData, session }) => {
  const isMobile = useIsMobile();
  return (
    <section className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-6 shadow">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-text mb-4 text-2xl font-bold">
          Aperçu de la classData
        </h2>

        {canInUniverse(session).updateOwn("class").granted && (
          <ShadLink
            href={`/classes/${classData.id}/edit`}
            size={isMobile ? "icon" : "default"}
          >
            {isMobile ? <Pencil className="h-6 w-6" /> : "Modifier"}
          </ShadLink>
        )}
      </div>
      <div className="flex flex-col items-center">
        <aside className="flex flex-col gap-3">
          <h3 className="text-text mb-1 w-full text-center text-xl font-semibold lg:text-start">
            {classData.name}
          </h3>
          <p className="text-muted-foreground text-sm">
            {classData.description}
          </p>
        </aside>
      </div>
    </section>
  );
};

export const ClassResume = withSessionProvider(ClassResumeOne);
