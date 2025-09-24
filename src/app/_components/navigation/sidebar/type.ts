import type { LucideIcon } from "lucide-react";

export interface NavLink {
  title: string;
  label?: string;
  href?: string;
  icon: LucideIcon;
  children?: NavLinkChildren[];
}

export interface NavLinkChildren {
  title: string;
  label?: string;
  href: string;
  icon: LucideIcon;
}

export type ExclusiveNavLink =
  | (NavLink & { href: string; children?: never })
  | (NavLink & { href?: never; children: NavLinkChildren[] });

export interface GroupedNavLink {
  groupTitle?: string;
  defaultOpen?: boolean;
  links: ExclusiveNavLink[];
}
