"use client";

import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { List } from "lucide-react";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/app/_components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/app/_components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/app/_components/ui/tooltip";
import type { UniverseWithUsers } from "~/lib/models/Univers";
import { cn, formatUniverseRole, SwitchBorderColor } from "~/lib/utils";

interface UniversSwitcherProps {
  readonly univers: UniverseWithUsers[];
  readonly className?: string;
  readonly session: Session | null;
}

export const UniversSwitcher: React.FC<UniversSwitcherProps> = ({
  univers,
  session,
}) => {
  const { update } = useSession();
  const router = useRouter();

  const [selectedUnivers, setSelectedUnivers] = React.useState<
    UniverseWithUsers | undefined
  >(() => {
    if (session?.universeId) {
      return univers.find((c) =>
        c.Users.find((user) => user.id === session?.universeId),
      );
    }

    return undefined;
  });

  React.useEffect(() => {
    if (session?.universeId) {
      setSelectedUnivers(
        univers.find((c) =>
          c.Users.find((user) => user.id === session?.universeId),
        ),
      );
    }
  }, [session?.universeId, univers]);

  const [open, setOpen] = React.useState(false);

  async function onSelect(universeId: string) {
    await update({ ...session, universeId: universeId })
      .then(() => {
        setSelectedUnivers(univers.find((c) => c.id === universeId));
        setOpen(false);
        router.refresh();
      })
      .catch(() => {
        console.error("Error updating univers");
      });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              tooltip={"Changer d'univers"}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {selectedUnivers ? (
                <React.Fragment>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={"/monogramme.svg"}
                      alt={selectedUnivers.name.replace("_", " ")}
                    />
                    <AvatarFallback>
                      {selectedUnivers.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {selectedUnivers.name}
                    </span>
                    <span className="truncate text-xs">
                      {formatUniverseRole(selectedUnivers, session?.user.id)}
                    </span>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={"/monogramme.svg"} alt={"monogramme"} />
                    <AvatarFallback>SG</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      Sélectionnez un univers
                    </span>
                    <span className="truncate text-xs">ou créez-en un</span>
                  </div>
                </React.Fragment>
              )}
              <CaretSortIcon className="ml-auto size-4 shrink-0 opacity-50" />
            </SidebarMenuButton>
          </PopoverTrigger>

          <PopoverContent
            className="min-w-[200px] p-0"
            align="start"
            sideOffset={4}
          >
            <Command className="overflow-y-auto">
              <CommandInput placeholder="Cherchez un profil..." />
              <CommandList className="">
                <CommandEmpty>Aucun profil trouvé.</CommandEmpty>

                <CommandGroup heading={"Mes univers"}>
                  {univers.length === 0 && (
                    <CommandItem disabled>
                      Vous n&apos;avez pas d&apos;univers
                    </CommandItem>
                  )}
                  {univers.map((univers) => (
                    <Tooltip key={univers.id}>
                      <CommandItem
                        onSelect={() => void onSelect(univers.id)}
                        className={cn(
                          "rounded-l-none border-l-4 text-sm transition-all duration-150 hover:border-l-8",
                          SwitchBorderColor(univers, session?.user.id),
                        )}
                      >
                        <TooltipTrigger asChild>
                          <div className="flex h-full w-full items-center">
                            <Avatar className="mr-2 h-5 w-5">
                              <AvatarImage
                                src={"/monogramme.svg"}
                                alt={univers.name.replace("_", " ")}
                              />
                              <AvatarFallback>
                                {univers.name?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p>{univers.name}</p>
                              <p className="text-muted text-xs lowercase italic">
                                {formatUniverseRole(univers, session?.user.id)}
                              </p>
                            </div>
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedUnivers?.id === univers.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </div>
                        </TooltipTrigger>
                      </CommandItem>
                      <TooltipContent>
                        <p>
                          {univers.name} |{" "}
                          {formatUniverseRole(univers, session?.user.id)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </CommandGroup>
              </CommandList>
              <CommandSeparator />
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      router.push("/universes/new");
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Créer un univers
                  </CommandItem>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      router.push("/univers");
                    }}
                  >
                    <List className="mr-2 h-5 w-5" />
                    Voir tous mes univers
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export const UniversDropdownSwitcher: React.FC<UniversSwitcherProps> = ({
  univers,
}) => {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [selectedUnivers, setSelectedUnivers] = React.useState<
    UniverseWithUsers | undefined
  >(() => {
    if (session?.universeId) {
      return univers.find((c) => c.id === session?.universeId);
    }
    return undefined;
  });

  async function onSelect(universeId: string) {
    await update({ univers: { id: universeId } })
      .then(() => {
        setSelectedUnivers(univers.find((c) => c.id === universeId));
        setOpen(false);
        router.refresh();
      })
      .catch(() => {
        console.error("Error updating univers");
      });
  }

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
              {selectedUnivers ? (
                <React.Fragment>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={"/monogramme.svg"}
                      alt={selectedUnivers.name.replace("_", " ")}
                    />
                    <AvatarFallback>
                      {selectedUnivers.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {selectedUnivers.name}
                    </span>
                    <span className="truncate text-xs">
                      {formatUniverseRole(selectedUnivers, session?.user.id)}
                    </span>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={"/monogramme.svg"} alt={"monogramme"} />
                    <AvatarFallback>SG</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      Sélectionnez un univers
                    </span>
                    <span className="truncate text-xs">ou créez-en un</span>
                  </div>
                </React.Fragment>
              )}
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
                onClick={async () => {
                  await onSelect(univers.id);
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
                {selectedUnivers?.id === univers.id && (
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
