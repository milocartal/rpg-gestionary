"use client";

import { DollarSign, Home, Mail, Star, type LucideIcon } from "lucide-react";

import { cn } from "~/lib/utils";

import { SidebarTrigger, useSidebar } from "~/app/_components/ui/sidebar";
import { Fragment } from "react";
import type { Session } from "next-auth";
import { Link } from "~/app/_components/ui/link";
import { UserNav } from "./user-navigation";
import CustomImage from "~/app/_components/image";
import { PublicNavbar } from "~/app/_components/navigation";

interface PublicHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly session: Session | null;
}

export interface PublicHeaderLink {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const publicHeaderLinks: PublicHeaderLink[] = [
  { title: "Accueil", href: "/", icon: Home },
  { title: "Fonctionnalités", href: "/features", icon: Star },
  { title: "Offres", href: "/pricing", icon: DollarSign },
  { title: "Contact", href: "/contact", icon: Mail },
];

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  session,
  className,
}) => {
  const { isMobile } = useSidebar();

  return (
    <header
      className={cn(
        `bg-primary fixed z-10 flex h-20 w-full items-center justify-between px-4 text-white`,
        className,
      )}
    >
      <section className="flex items-center justify-center">
        {isMobile && (
          <Fragment>
            <SidebarTrigger />
            <PublicNavbar session={session} />
          </Fragment>
        )}
        <CustomImage
          src="/favicon.png"
          alt="SAGA Logo"
          width={60}
          height={40}
        />
        <h1 className="libertinus text-text ml-2 text-lg font-bold xl:text-2xl">
          <span className="libertinus-bold">RPG</span>{" "}
          <span className="libertinus-italic">Gestionary</span>
        </h1>
      </section>

      {!isMobile && (
        <nav className="flex flex-row items-end justify-center">
          {publicHeaderLinks.map((link) => (
            <Link
              key={link.href}
              variant="clearLink"
              className="text-text ml-2"
              href={link.href}
            >
              {link.title}
            </Link>
          ))}

          {session ? (
            <UserNav />
          ) : (
            <Link href="/login" variant="clearLink">
              Se connecter
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};
