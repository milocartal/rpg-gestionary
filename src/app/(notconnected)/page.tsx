import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="h-auto w-full px-[10vw] py-[4vh] pt-28">
        <section className="bg-castle flex h-[50vh] w-full flex-col items-center justify-center gap-4 bg-cover bg-center bg-no-repeat p-6 text-white">
          <h2 className="text-2xl font-bold">
            Libérez votre imagination avec RPG Gestionary
          </h2>
          <p className="text-center">
            Créez des mondes immersifs, gérez des personnages complexes et
            donnez vie à votre jeu de rôle avec notre tableau de bord intuitif.
          </p>
        </section>
        <section>
          <h3 className="mt-4 text-2xl font-bold">Découvrez RPG Gestionary</h3>
          <p>
            Explorez les fonctionnalités qui font de RPG Gestionary l&apos;outil
            ultime pour les maîtres de jeu. De la construction de mondes à la
            gestion des personnages, nous avons tout ce qu&apos;il vous faut.
          </p>
        </section>
        <section>
          <h3 className="mt-4 text-2xl font-bold">
            Pourquoi choisir RPG Gestionary ?
          </h3>

          <h4 className="mt-2 text-xl font-bold">
            Donner du Pouvoir aux Maîtres de Jeu
          </h4>
          <p>
            RPG Gestionary fournit les outils et le soutien dont vous avez
            besoin pour créer des expériences de jeu inoubliables.
          </p>

          <p>
            <i>
              Je suis une liste de carte sur les fonctionnalités de RPG
              Gestionary
            </i>
          </p>
        </section>
      </main>
    </HydrateClient>
  );
}
