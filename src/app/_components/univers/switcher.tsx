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
import { api } from "~/trpc/react";

interface UniversSwitcherProps {
  readonly universes: UniverseWithUsers[];
  readonly className?: string;
  readonly session: Session | null;
}

export const UniversSwitcher: React.FC<UniversSwitcherProps> = ({
  session,
}) => {
  const { update } = useSession();
  const router = useRouter();

  const { data, isLoading } = api.universe.getAllFromSession.useQuery();

  React.useEffect(() => {
    if (data) {
      setUniverses(data);
    }
  }, [data]);

  const [universes, setUniverses] = React.useState<UniverseWithUsers[]>(
    data ?? [],
  );

  const [selectedUniverse, setSelectedUniverse] = React.useState<
    UniverseWithUsers | undefined
  >(() => {
    if (session?.universeId) {
      return universes.find((c) =>
        c.Users.find((user) => user.id === session?.universeId),
      );
    }

    return undefined;
  });

  React.useEffect(() => {
    if (session?.universeId) {
      setSelectedUniverse(
        universes.find((c) =>
          c.Users.find((user) => user.id === session?.universeId),
        ),
      );
    }
  }, [session?.universeId, universes]);

  const [open, setOpen] = React.useState(false);

  async function onSelect(universeId: string) {
    await update({ ...session, universeId: universeId })
      .then(() => {
        setSelectedUniverse(universes.find((c) => c.id === universeId));
        setOpen(false);
        router.refresh();
      })
      .catch(() => {
        console.error("Error updating universes");
      });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              tooltip={"Changer d'universes"}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {isLoading ? (
                <React.Fragment>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={"/monogramme.svg"} alt={"monogramme"} />
                    <AvatarFallback>SG</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      Chargement des universes...
                    </span>
                    <span className="truncate text-xs">Veuillez patienter</span>
                  </div>
                </React.Fragment>
              ) : selectedUniverse ? (
                <React.Fragment>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={"/monogramme.svg"}
                      alt={selectedUniverse.name.replace("_", " ")}
                    />
                    <AvatarFallback>
                      {selectedUniverse.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {selectedUniverse.name}
                    </span>
                    <span className="truncate text-xs">
                      {formatUniverseRole(selectedUniverse, session?.user.id)}
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

                <CommandGroup heading={"Mes universes"}>
                  {isLoading ? (
                    <CommandItem
                      disabled
                      className="animate-pulse cursor-not-allowed"
                    >
                      Chargement des universes...
                    </CommandItem>
                  ) : (
                    universes.length === 0 && (
                      <CommandItem disabled>
                        Vous n&apos;avez pas d&apos;universes
                      </CommandItem>
                    )
                  )}
                  {universes.map((universe) => (
                    <Tooltip key={universe.id}>
                      <CommandItem
                        onSelect={() => void onSelect(universe.id)}
                        className={cn(
                          "rounded-l-none border-l-4 text-sm transition-all duration-150 hover:border-l-8",
                          SwitchBorderColor(universe, session?.user.id),
                        )}
                      >
                        <TooltipTrigger asChild>
                          <div className="flex h-full w-full items-center">
                            <Avatar className="mr-2 h-5 w-5">
                              <AvatarImage
                                src={"/monogramme.svg"}
                                alt={universe.name.replace("_", " ")}
                              />
                              <AvatarFallback>
                                {universe.name?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p>{universe.name}</p>
                              <p className="text-muted text-xs lowercase italic">
                                {formatUniverseRole(universe, session?.user.id)}
                              </p>
                            </div>
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedUniverse?.id === universe.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </div>
                        </TooltipTrigger>
                      </CommandItem>
                      <TooltipContent>
                        <p>
                          {universe.name} |{" "}
                          {formatUniverseRole(universe, session?.user.id)}
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
                      router.push("/universes");
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
