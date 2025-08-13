import { HydrateClient } from "~/trpc/server";
import { Header } from "~/app/_components/header/header";

import { Link } from "~/app/_components/ui/link";

export default async function ConditionsGeneralesUtilisation() {
  return (
    <HydrateClient>
      <Header title={`Conditions générales d'utilisation | SAGA`} />
      <main className="relative flex min-h-screen flex-col items-center justify-start gap-12 p-6 pt-24">
        <section className="bg-primary/1 flex w-full flex-col items-start justify-start gap-4 rounded-md p-6 shadow">
          <div className="mb-4">
            <h1 className="mb-2 text-3xl font-bold">
              Conditions générales d&apos;utilisation
            </h1>
            <p className="text-muted-foreground">
              <span className="font-semibold">Dernière mise à jour :</span> 12
              août 2025
            </p>
          </div>

          <div className="space-y-6">
            <article>
              <h2 className="mb-3 text-2xl font-bold">1. Objet</h2>
              <div className="space-y-2">
                <p>
                  Les présentes CGU régissent l&apos;utilisation de la
                  plateforme
                  <span className="font-semibold"> RPG Gestionary</span>, dédiée
                  à la gestion de fiches de personnages et familiers pour jeux
                  de rôle.
                </p>
              </div>
            </article>

            <article>
              <h2 className="mb-3 text-2xl font-bold">
                2. Inscription et compte
              </h2>
              <div className="space-y-2">
                <p>L&apos;inscription est gratuite.</p>
                <p>
                  L&apos;utilisateur est responsable de la confidentialité de
                  ses identifiants.
                </p>
                <p>
                  L&apos;éditeur se réserve le droit de suspendre un compte en
                  cas de non-respect des règles.
                </p>
              </div>
            </article>

            <article>
              <h2 className="mb-3 text-2xl font-bold">
                3. Contenus des utilisateurs
              </h2>
              <div className="space-y-2">
                <p>
                  L&apos;utilisateur conserve la propriété des fiches créées.
                </p>
                <p>
                  En publiant un contenu, l&apos;utilisateur accorde à la
                  plateforme un droit de l&apos;afficher pour les besoins du
                  service.
                </p>
                <p>
                  Les contenus illégaux ou contraires aux bonnes mœurs sont
                  interdits.
                </p>
              </div>
            </article>

            <article>
              <h2 className="mb-3 text-2xl font-bold">4. Responsabilités</h2>
              <div className="space-y-2">
                <p>
                  L&apos;éditeur n&apos;est pas responsable des pertes de
                  données causées par un incident technique indépendant de sa
                  volonté.
                </p>
                <p>
                  L&apos;utilisateur est seul responsable de l&apos;usage de ses
                  données.
                </p>
              </div>
            </article>

            <article>
              <h2 className="mb-3 text-2xl font-bold">5. Modifications</h2>
              <div className="space-y-2">
                <p>
                  La plateforme peut modifier ces CGU à tout moment.
                  L&apos;utilisateur sera informé par email ou notification.
                </p>
              </div>
            </article>

            <article>
              <h2 className="mb-3 text-2xl font-bold">Contact</h2>
              <div className="space-y-2">
                <p>
                  Pour toute question concernant ces conditions
                  d&apos;utilisation, vous pouvez nous contacter à :{" "}
                  <Link
                    href="mailto:agence.cart.all@gmail.com"
                    variant="link"
                    className="p-0"
                  >
                    agence.cart.all@gmail.com
                  </Link>
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
