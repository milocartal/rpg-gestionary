"use client";

import { ChevronDown } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "~/app/_components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/app/_components/ui/collapsible";

import type { GroupedNavLink } from "./type";
import { NavItem } from "./item";

export function NavGroup({ group }: { readonly group: GroupedNavLink }) {
  if (group.groupTitle) {
    return (
      <Collapsible
        defaultOpen={group.defaultOpen}
        className="group/collapsible"
      >
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger className="cursor-pointer">
              {group.groupTitle}
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              {group.links.map((link, index) => {
                return <NavItem key={link.title + index} link={link} />;
              })}
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    );
  } else {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          {group.links.map((link, index) => {
            return <NavItem key={link.title + index} link={link} />;
          })}
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }
}
