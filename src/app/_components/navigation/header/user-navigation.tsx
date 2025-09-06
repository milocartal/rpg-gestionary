"use client";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";
import { Button } from "~/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { api } from "~/trpc/react";

import { toFallback } from "~/lib/utils";
import { signOut } from "next-auth/react";

export function UserNav() {
  const router = useRouter();
  const { data: user } = api.user.getActual.useQuery();

  if (!user) {
    return null;
  }

  const img = user.image ?? "/avatar.svg";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={img} alt={user.name ?? "User Avatar"} />
            <AvatarFallback>{toFallback(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {user.name && (
              <p className="text-sm leading-none font-medium">{user.name}</p>
            )}
            {user.email && (
              <p className="text-muted-foreground text-xs leading-none">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/account")}>
            Mon compte
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            Paramètres
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/universes/new")}>
            Nouvel univers
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
