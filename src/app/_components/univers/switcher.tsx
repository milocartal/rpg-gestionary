"use client";

import { type Univers } from "@prisma/client";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/app/_components/ui/sidebar";
import type { UniversWithUsers } from "~/lib/models/Univers";

interface UniversSwitcherProps {
  readonly univers: UniversWithUsers[];
  readonly className?: string;
  readonly session: Session | null;
}

export const UniversSwitcher: React.FC<UniversSwitcherProps> = ({
  univers,
  session,
}) => {
  const { update } = useSession();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [selectedUnivers, setSelectedUnivers] = React.useState<Univers>(() => {
    if (session?.univers) {
      return univers.find((c) => c.id === session.univers!.id)!;
    }

    return univers[0]!;
  });

  React.useEffect(() => {
    if (session?.univers) {
      setSelectedUnivers(univers.find((p) => p.id === session.univers!.id)!);
    }
  }, [session?.univers, univers]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={"Choisissez une entreprise"}
              variant={"outline"}
              aria-expanded={open}
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={undefined}
                  alt={selectedUnivers.name.replace("_", " ")}
                />
                <AvatarFallback>
                  {selectedUnivers.name?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {selectedUnivers.name.length > 12
                    ? selectedUnivers.name.slice(0, 12) + "..."
                    : selectedUnivers.name}
                </span>
              </div>
              <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="max-h-[30vh] w-[--radix-dropdown-menu-trigger-width] min-w-56 overflow-y-auto rounded-lg"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel>Choisissez un univers</DropdownMenuLabel>
            {univers.map((univers) => (
              <DropdownMenuItem
                key={univers.id}
                onClick={() => {
                  if (session) {
                    void update({
                      univers: {
                        id: univers.id,
                        role:
                          univers.Users.find(
                            (temp) => temp.userId === session.user.id,
                          )?.role ?? "spectator",
                      },
                    }).then(() => {
                      setSelectedUnivers(univers);
                      setOpen(false);
                      router.refresh();
                    });
                  }
                }}
                className="gap-2 p-2"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={undefined}
                    alt={univers.name.replace("_", " ")}
                  />
                  <AvatarFallback>{univers.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                {univers.name}
                {selectedUnivers.id === univers.id && (
                  <CheckIcon className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
