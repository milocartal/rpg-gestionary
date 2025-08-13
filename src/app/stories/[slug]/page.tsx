import { type Metadata } from "next";
import { notFound, unauthorized } from "next/navigation";

import { StoryResume } from "~/app/_components/story";
import { Header } from "~/app/_components/header/header";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import "~/styles/globals.css";
import { HydrateClient } from "~/trpc/server";

import NewStory from "~/app/stories/new/page";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "new") {
    return {
      title: "Nouvel histoire",
      description: "Création d'une nouvelle histoire",
    };
  }

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
    title: `${story.name} | SAGA`,
    description: `Détails de l'histoire ${story.name}`,
  };
}

export default async function StoryDetail({ params }: Props) {
  const { slug } = await params;
  if (slug === "new") {
    return NewStory();
  }

  const session = await auth();

  if (!session) {
    unauthorized();
  }

  const story = await db.story
    .findUniqueOrThrow({
      where: { id: slug },
    })
    .catch(() => {
      console.error("Story not found");
      notFound();
    });

  return (
    <HydrateClient>
      <Header back title={`Histoire ${story.name}`} />
      <main className="relative flex min-h-screen flex-col items-center gap-4 bg-[url('/assets/images/bg.webp')] bg-cover bg-fixed px-4 pt-24 pb-10">
        <StoryResume story={story} session={session} />
      </main>
    </HydrateClient>
  );
}
