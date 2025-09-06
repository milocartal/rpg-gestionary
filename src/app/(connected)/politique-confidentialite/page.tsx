import { HydrateClient } from "~/trpc/server";
import { Header } from "~/app/_components/navigation";

import { Link } from "~/app/_components/ui/link";

export default async function PolitiqueConfidentialite() {
  return (
    <HydrateClient>
      <Header title={`Politique de confidentialité | RPG Gestionary`} />
      <main className="relative flex min-h-screen flex-col items-center justify-start gap-12 p-6 pt-24">
        <section className="bg-primary/1 flex w-full flex-col items-start justify-start gap-4 rounded-md p-6 shadow">
          <div className="mb-4">
            <h2 className="mb-2 text-3xl font-bold">
              Politique de confidentialité
            </h2>
            <p className="text-muted-foreground">
              <span className="font-semibold">Dernière mise à jour :</span> 12
              août 2025
            </p>
          </div>

          <div className="space-y-6">
            <p>
              La présente politique de confidentialité a pour but
              d&apos;informer les utilisateurs du site
              <span className="font-semibold"> RPG Gestionary</span> sur la
              collecte et le traitement de leurs données personnelles.
            </p>

            <article>
              <h3 className="mb-3 text-2xl font-bold">1. Données collectées</h3>
              <div className="space-y-2">
                <p>
                  Lors de l&apos;utilisation de la plateforme, les données
                  suivantes peuvent être collectées :
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    Adresse email (via l&apos;inscription ou
                    l&apos;authentification NextAuth)
                  </li>
                  <li>Identifiant ou pseudonyme</li>
                  <li>Adresse IP (pour raisons techniques et sécurité)</li>
                  <li>
                    Données de jeu (fiches de personnages et familiers créées
                    par l&apos;utilisateur)
                  </li>
                </ul>
              </div>
            </article>

            <article>
              <h3 className="mb-3 text-2xl font-bold">
                2. Finalités du traitement
              </h3>
              <div className="space-y-2">
                <p>Ces données sont utilisées pour :</p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Fournir l&apos;accès au compte utilisateur</li>
                  <li>Sauvegarder et afficher les fiches créées</li>
                  <li>Assurer la sécurité du site</li>
                  <li>Améliorer l&apos;expérience utilisateur</li>
                </ul>
              </div>
            </article>

            <article>
              <h3 className="mb-3 text-2xl font-bold">3. Base légale</h3>
              <div className="space-y-2">
                <p>La collecte est basée sur :</p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    L&apos;exécution d&apos;un contrat (CGU acceptées lors de
                    l&apos;inscription)
                  </li>
                  <li>
                    Le consentement de l&apos;utilisateur (pour cookies non
                    essentiels)
                  </li>
                </ul>
              </div>
            </article>

            <article>
              <h3 className="mb-3 text-2xl font-bold">
                4. Durée de conservation
              </h3>
              <div className="space-y-2">
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    <span className="font-semibold">Données du compte :</span>{" "}
                    tant que le compte est actif
                  </li>
                  <li>
                    <span className="font-semibold">Données de jeu :</span>{" "}
                    jusqu&apos;à suppression du compte par l&apos;utilisateur
                  </li>
                  <li>
                    <span className="font-semibold">Cookies de session :</span>{" "}
                    durée maximale 30 jours
                  </li>
                </ul>
              </div>
            </article>

            <article>
              <h3 className="mb-3 text-2xl font-bold">5. Accès et partage</h3>
              <div className="space-y-2">
                <p>Les données ne sont pas revendues.</p>
                <p>Elles peuvent être accessibles :</p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    À l&apos;hébergeur (Hetzner Online GmbH) pour maintenance
                    technique
                  </li>
                  <li>Aux autorités sur demande légale</li>
                </ul>
              </div>
            </article>

            <article>
              <h3 className="mb-3 text-2xl font-bold">
                6. Droits des utilisateurs
              </h3>
              <div className="space-y-2">
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Accès, rectification, suppression</li>
                  <li>Limitation ou opposition au traitement</li>
                  <li>Portabilité des données</li>
                </ul>
                <p className="mt-3">
                  Pour exercer vos droits, contactez :{" "}
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

            <article>
              <h3 className="mb-3 text-2xl font-bold">7. Sécurité</h3>
              <div className="space-y-2">
                <p>
                  Les données sont stockées sur des serveurs sécurisés situés en
                  Europe (Hetzner, Allemagne).
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
