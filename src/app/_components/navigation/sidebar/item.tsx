"use client";

import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";

import { Button } from "~/app/_components/ui/button";
import { Link as ShadLink } from "~/app/_components/ui/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/app/_components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/app/_components/ui/collapsible";
import type { NavLink } from "./type";

export function NavItem({ link }: { readonly link: NavLink }) {
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
