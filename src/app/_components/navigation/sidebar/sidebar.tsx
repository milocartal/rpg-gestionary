"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

import { UniversSwitcher } from "~/app/_components/univers/switcher";
import type { UniverseWithUsers } from "~/lib/models/Univers";
import { withSessionProvider } from "~/utils/withSessionProvider";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "~/app/_components/ui/sidebar";

import { NormalConnectionButton } from "~/app/_components/connection/button";
import { SidebarUserNav } from "./navbar-footer";
import type { GroupedNavLink } from "./type";

import { NavGroup } from "./group";
import { can, canInUniverse } from "~/utils/accesscontrol";
import {
  adminLinks,
  legalsLinks,
  universesDefaultLinks,
  universesManagerLinks,
  universesMasterLinks,
} from "./links";

interface NavbarProps {
  readonly session: Session | null;
  readonly univers: UniverseWithUsers[];
}

const NavbarOne: React.FC<NavbarProps> = ({ session, univers }) => {
  const path = usePathname();

  const { open, isMobile, setOpenMobile } = useSidebar();

  if (
    path.includes("/forgot-password") ||
    path.includes("/reset-password") ||
    path.includes("/register") ||
    path.includes("/login")
  ) {
    return null;
  }

  let links: GroupedNavLink[] = [];

  if (canInUniverse(session).readAny("maitre-du-jeu")) {
    links = universesMasterLinks;
  } else if (canInUniverse(session).readAny("gestionnaire")) {
    links = universesManagerLinks;
  } else if (canInUniverse(session).readAny("default")) {
    links = universesDefaultLinks;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-primary items-center justify-center border-b px-0 py-2">
        <Link
          href="/"
          className="cursor-pointer"
          onClick={() => {
            if (isMobile) setOpenMobile(false);
          }}
        >
          <div className="flex h-16 items-center justify-center">
            <Image
              src={"/favicon.png"}
              alt="logo"
              width={!open ? 50 : 60}
              height={40}
              className={
                open
                  ? "-ml-2"
                  : "" /* TODO refaire l'image pour que ce soir bord à bord */
              }
              priority
              quality={100}
            />
            {open && (
              <h1 className="libertinus text-start text-2xl text-white">
                <span className="libertinus-bold">RPG</span>{" "}
                <span className="libertinus-italic">Gestionary</span>
              </h1>
            )}
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {session && (
          <Fragment>
            <SidebarGroup className="gap-2">
              <UniversSwitcher universes={univers} session={session} />
            </SidebarGroup>
            <SidebarSeparator />
          </Fragment>
        )}
        {links.map((group, index) => {
          return (
            <Fragment key={index}>
              <NavGroup group={group} />
              {index !== links.length - 1 && <SidebarSeparator />}
            </Fragment>
          );
        })}
        {can(session).readAny("admin") && (
          <Fragment>
            <SidebarSeparator />
            <NavGroup group={adminLinks} />
          </Fragment>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavGroup group={legalsLinks} />
        {session ? (
          <SidebarUserNav session={session} />
        ) : (
          <NormalConnectionButton session={session} open={open} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

const Navbar = withSessionProvider(NavbarOne);

export default Navbar;
