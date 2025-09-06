"use client";
import CustomImage from "~/app/_components/image";
import { Link } from "~/app/_components/ui/link";
import { publicHeaderLinks } from "./header/public-header";
import type { Session } from "next-auth";
import { Button } from "~/app/_components/ui/button";
import { signOut } from "next-auth/react";
import { Separator } from "~/app/_components/ui/separator";

export const Footer: React.FC<{ session: Session | null }> = ({ session }) => {
  return (
    <footer className="space-y-6 bg-gray-800 py-4 text-center text-white lg:px-[10vw]">
      <section className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-auto flex-col items-center justify-center lg:flex-row">
          <CustomImage
            src="/favicon.png"
            alt="SAGA Logo"
            width={120}
            height={40}
          />

          <h1 className="libertinus flex w-auto flex-col text-center text-xl text-white lg:block lg:text-start lg:text-2xl xl:text-3xl">
            <span className="libertinus-bold">RPG</span>{" "}
            <span className="libertinus-italic">Gestionary</span>
          </h1>
        </div>

        <div className="flex flex-col items-center gap-[3rem] px-[5vw] lg:flex-row lg:items-start lg:justify-end lg:gap-[6rem]">
          <Separator className="mt-[3rem] w-full lg:hidden" />
          <article className="flex w-full flex-row items-start justify-start gap-[3rem] lg:w-auto lg:flex-col lg:gap-2">
            <h5 className="w-[35vw] text-start text-lg font-bold lg:w-auto">
              Navigation
            </h5>
            <div className="flex flex-col items-start gap-2">
              {publicHeaderLinks.map((link) => (
                <Link
                  key={link.href}
                  variant="clearLink"
                  size={"link"}
                  className="text-sm"
                  href={link.href}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </article>
          {session && <Separator className="w-full lg:hidden" />}
          {session && (
            <article className="flex w-full flex-row items-start justify-start gap-[3rem] lg:w-auto lg:flex-col lg:gap-2">
              <h5 className="w-[35vw] text-start text-lg font-bold lg:w-auto">
                Compte
              </h5>
              <div className="flex flex-col items-start gap-2">
                <Link
                  variant="clearLink"
                  className="text-sm"
                  href={"/dashboard"}
                  size={"link"}
                >
                  Tableau de bord
                </Link>
                <Link
                  variant="clearLink"
                  className="text-sm"
                  href={"/account"}
                  size={"link"}
                >
                  Mon Compte
                </Link>
                <Button
                  className="w-full"
                  size={"link"}
                  variant={"clearLink"}
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Se déconnecter
                </Button>
              </div>
            </article>
          )}
        </div>
      </section>
      <Separator className="w-full lg:hidden" />
      <section className="mt-2 flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Milo CARTAL. Tous droits réservés.
        </p>

        <Link
          href="/politique-confidentialite"
          className="text-sm"
          variant={"clearLink"}
        >
          Politique de confidentialité
        </Link>

        <Link
          href="/mentions-legales"
          className="text-sm"
          variant={"clearLink"}
        >
          Mentions légales
        </Link>

        <Link href="/cgu" className="text-sm" variant={"clearLink"}>
          Conditions générales d&apos;utilisation
        </Link>
      </section>
      <p className="mt-2 text-xs">Réalisé avec ❤️ par Milo CARTAL</p>
    </footer>
  );
};
