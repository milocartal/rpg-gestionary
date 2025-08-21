import { type Metadata } from "next";
import { forbidden, notFound, unauthorized } from "next/navigation";

import { UpdateStory } from "~/app/_components/story";
import { Header } from "~/app/_components/navigation";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import { canInUniverse } from "~/utils/accesscontrol";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await db.story.findUnique({
    where: { id: slug },
  });

  if (!story) {
    return {
      title: "Histoire introuvable",
      description: "L'histoire que vous cherchez n'existe pas",
    };
  }

  return {
    title: `Modifier ${story.name} | RPG Gestionary`,
    description: `Modifier l'histoire ${story.name}`,
  };
}

export default async function StoryUpdate({ params }: Props) {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  if (!canInUniverse(session).updateOwn("story").granted) {
    forbidden();
  }

  const { slug } = await params;

  const story = await db.story.findUnique({
    where: { id: slug },
  });

  if (!story) {
    notFound();
  }

  return (
    <HydrateClient>
      <Header back title={`Histoire : ${story.name}`} />
      <main className="relative flex min-h-screen flex-col items-center bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <div className="bg-background flex h-full w-full flex-col rounded-lg px-6 py-4 shadow">
          <UpdateStory story={story} />
        </div>
      </main>
    </HydrateClient>
  );
}
