import { HydrateClient } from "~/trpc/server";
import { Header } from "~/app/_components/navigation";

import { Link } from "~/app/_components/ui/link";

export default async function MentionsLegales() {
  return (
    <HydrateClient>
      <Header title={`Mentions légales | RPG Gestionary`} />
      <main className="relative flex min-h-screen flex-col items-center justify-start gap-12 p-6 pt-24">
        <section className="bg-primary/1 flex w-full flex-col items-start justify-start gap-4 rounded-md p-6 shadow">
          <article>
            <h2 className="text-2xl font-bold">Éditeur du site</h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Éditeur :</span> Milo CARTAL
                (Cart&apos;All)
              </p>
              <p>
                <span className="font-semibold">Contact :</span>{" "}
                <Link
                  href="mailto:agence.cart.all@gmail.com"
                  variant="link"
                  size={"sm"}
                  className="p-0"
                >
                  agence.cart.all@gmail.com
                </Link>
              </p>
              <p className="text-muted-foreground italic">
                Activité non commerciale – non assujetti au registre du commerce
                et des sociétés.
              </p>
            </div>
          </article>

          <article>
            <h2 className="text-2xl font-bold">Hébergement</h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Hébergeur :</span> Hetzner
                Online GmbH
              </p>
              <p>
                <span className="font-semibold">Adresse :</span> Industriestr.
                25, 91710 Gunzenhausen, Allemagne
              </p>
              <p>
                <span className="font-semibold">Téléphone :</span> +49 (0)9831
                505-0
              </p>
              <p>
                <span className="font-semibold">Site web :</span>{" "}
                <Link
                  href="https://www.hetzner.com/"
                  variant="link"
                  size={"sm"}
                  className="p-0"
                >
                  https://www.hetzner.com/
                </Link>
              </p>
            </div>
          </article>

          <article>
            <h2 className="text-2xl font-bold">Propriété intellectuelle</h2>
            <div className="space-y-2">
              <p>
                Tout contenu présent sur ce site (
                <span className="italic">
                  textes, images, illustrations, etc.
                </span>
                ) est protégé par le droit d’auteur.
              </p>
              <p>
                Toute reproduction ou utilisation sans accord préalable est
                interdite.
              </p>
            </div>
          </article>

          <article>
            <h2 className="text-2xl font-bold">Responsabilité</h2>
            <div className="space-y-2">
              <p>
                L’éditeur ne saurait être tenu pour responsable des contenus
                publiés par les utilisateurs.
              </p>
              <p>
                Les utilisateurs s’engagent à respecter la législation en
                vigueur.
              </p>
            </div>
          </article>
        </section>
      </main>
    </HydrateClient>
  );
}
