"use client";

import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

import { cn } from "~/lib/utils";

import { withSessionProvider } from "~/utils/withSessionProvider";

import { Link as ShadLink } from "~/app/_components/ui/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/app/_components/ui/sidebar";

import { NormalConnectionButton } from "~/app/_components/connection/button";
import { publicHeaderLinks, type PublicHeaderLink } from "../header";

interface PublicNavbarProps {
  readonly session: Session | null;
}

const PublicNavbarOne: React.FC<PublicNavbarProps> = ({ session }) => {
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
        <SidebarGroup>
          {publicHeaderLinks.map((link, index) => {
            return <PublicNavItem key={link.title + index} link={link} />;
          })}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {session && (
          <ShadLink href="/account" variant={"accent"}>
            Mon Compte
          </ShadLink>
        )}
        <NormalConnectionButton session={session} open={open} />
      </SidebarFooter>
    </Sidebar>
  );
};

const PublicNavbar = withSessionProvider(PublicNavbarOne);

export { PublicNavbar };

function PublicNavItem({ link }: { readonly link: PublicHeaderLink }) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      <SidebarMenuItem key={link.href}>
        <SidebarMenuButton asChild tooltip={link.title}>
          <ShadLink
            href={link.href}
            className={cn(
              "justify-start",
              !pathname.includes(link.href) && "text-text",
            )}
            variant={pathname.includes(link.href) ? "default" : null}
          >
            <link.icon
              className={cn(
                "h-4 w-4",
                pathname.includes(link.href) ? "text-secondary" : "text-accent",
              )}
            />
            <span>{link.title}</span>
          </ShadLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
