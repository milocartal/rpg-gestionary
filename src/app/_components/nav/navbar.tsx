"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

import {
  Binary,
  BookMarked,
  Box,
  type LucideIcon,
  Newspaper,
  Origami,
  PawPrint,
  Power,
  PowerOff,
  ReceiptText,
  ScrollText,
  Transgender,
  UsersRound,
} from "lucide-react";

import { cn } from "~/lib/utils";
import { UniversSwitcher } from "~/app/_components/univers/switcher";
import type { UniversWithUsers } from "~/lib/models/Univers";
import { withSessionProvider } from "~/utils/withSessionProvider";

import { Button } from "~/app/_components/ui/button";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "~/app/_components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/app/_components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/app/_components/ui/collapsible";

interface NavLink {
  title: string;
  label?: string;
  href?: string;
  icon: LucideIcon;
  children?: NavLinkChildren[];
}

interface NavLinkChildren {
  title: string;
  label?: string;
  href: string;
  icon: LucideIcon;
}

type ExclusiveNavLink =
  | (NavLink & { href: string; children?: never })
  | (NavLink & { href?: never; children: NavLinkChildren[] });

const links: ExclusiveNavLink[][] = [
  [
    {
      title: "Univers",
      icon: Box,
      children: [
        {
          title: "Contexte",
          href: "/context",
          icon: ScrollText,
        },
        {
          title: "Histoires",
          href: "/stories",
          icon: BookMarked,
        },
        {
          title: "Populations",
          href: "/populations",
          icon: UsersRound,
        },
        {
          title: "Espèces",
          href: "/species",
          icon: PawPrint,
        },
        {
          title: "Compétences",
          href: "/skills",
          icon: Binary,
        },
        {
          title: "Sexes",
          href: "/sexes",
          icon: Transgender,
        },
      ],
    },
    {
      title: "Événements",
      href: "/events",
      icon: Newspaper,
    },
  ],
  [
    {
      title: "Personnages",
      href: "/characters",
      icon: ReceiptText,
    },
    {
      title: "Compagnons",
      href: "/companions",
      icon: Origami,
    },
  ],
];

interface NavbarProps {
  readonly session: Session | null;
  readonly univers: UniversWithUsers[];
}

const NavbarOne: React.FC<NavbarProps> = ({ session, univers }) => {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-primary border-b px-0 py-2">
        <Link href="/" className="cursor-pointer">
          <div className="flex h-16 items-center justify-center">
            {/* open ? (
              <h1 className="text-secondary text-2xl font-bold">SAGA</h1>
            ) : (
              <h1 className="text-secondary text-lg font-bold">S</h1>
            ) */}
            <Image
              src={!open ? "/monogramme.svg" : "/text.svg"}
              alt="logo"
              width={!open ? 40 : 125}
              height={40}
            />
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="gap-2">
          <UniversSwitcher univers={univers} session={session} />
        </SidebarGroup>
        <SidebarSeparator />
        {links.map((group, index) => {
          return (
            <Fragment key={index}>
              <SidebarGroup>
                {group.map((link, index) => {
                  return <NavItem key={link.title + index} link={link} />;
                })}
              </SidebarGroup>
              {index !== links.length - 1 && <SidebarSeparator />}
            </Fragment>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <ConnectionButton session={session} open={open} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

const Navbar = withSessionProvider(NavbarOne);

export default Navbar;

function NavItem({ link }: { readonly link: NavLink }) {
  const pathname = usePathname();
  if (link.href) {
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
                  pathname.includes(link.href)
                    ? "text-secondary"
                    : "text-accent",
                )}
              />
              <span>{link.title}</span>
            </ShadLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  } else if (link.children) {
    return (
      <SidebarMenu>
        <Collapsible
          defaultOpen={link.children.some((child) =>
            pathname.includes(child.href),
          )}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton asChild tooltip={link.label}>
                <Button
                  className={cn(
                    "justify-start",
                    !link.children.some((child) =>
                      pathname.includes(child.href),
                    ) && "text-text",
                  )}
                  variant={
                    link.children.some((child) => pathname.includes(child.href))
                      ? "default"
                      : null
                  }
                >
                  <link.icon
                    className={cn(
                      "h-4 w-4",
                      link.children.some((child) =>
                        pathname.includes(child.href),
                      )
                        ? "text-secondary"
                        : "text-accent",
                    )}
                  />
                  <span>{link.title}</span>
                </Button>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {link.children.map((child) => {
                  return (
                    <SidebarMenuSubItem key={child.href} className="">
                      <SidebarMenuSubButton asChild>
                        <ShadLink
                          href={child.href}
                          className={cn(
                            "justify-start",
                            !pathname.includes(child.href) && "text-text",
                          )}
                          variant={
                            pathname.includes(child.href) ? "default" : null
                          }
                        >
                          <child.icon
                            className={cn(
                              "h-4 w-4",
                              pathname.includes(child.href)
                                ? "text-secondary"
                                : "text-accent",
                            )}
                          />
                          <span>{child.title}</span>
                        </ShadLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    );
  }
  return null;
}

export const ConnectionButton: React.FC<{
  readonly session: Session | null;
  open?: boolean;
}> = ({ session, open = true }) => {
  return (
    <Fragment>
      {session ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="w-full"
              variant={"secondary"}
              onClick={() => signOut({ callbackUrl: "/" })}
              size={!open ? "icon" : "default"}
            >
              <PowerOff className={"h-4 w-4"} />
              <span className={cn("ml-2", !open && "sr-only")}>
                Se déconnecter
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className={!open ? "" : "hidden"}>
            Se déconnecter
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="w-full"
              variant={"accent"}
              onClick={() => signIn()}
              size={!open ? "icon" : "default"}
            >
              <Power className={"h-4 w-4"} />
              <span className={cn("ml-2", !open && "sr-only")}>
                Se connecter
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className={!open ? "" : "hidden"}>
            Se connecter
          </TooltipContent>
        </Tooltip>
      )}
    </Fragment>
  );
};
