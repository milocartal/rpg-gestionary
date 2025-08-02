"use client";

import { signIn, signOut } from "next-auth/react";
import { Fragment } from "react";
import { Power, PowerOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/app/_components/ui/tooltip";
import { Button } from "~/app/_components/ui/button";
import { cn } from "~/lib/utils";
import type { Session } from "next-auth";
import CustomImage from "../image";

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

export const DiscordButton: React.FC = () => {
  return (
    <Button
      variant="discord"
      className="w-auto"
      type="button"
      size={"lg"}
      onClick={() => {
        void signIn("discord");
      }}
    >
      <CustomImage
        src="/discord-avatar-light-blurple.svg"
        alt="Discord"
        width={32}
        height={32}
        className="mr-1"
      />
      Discord
    </Button>
  );
};

export const GitHubButton: React.FC = () => {
  return (
    <Button
      variant="github"
      className="w-auto"
      type="button"
      size={"lg"}
      onClick={() => {
        void signIn("github");
      }}
    >
      <CustomImage
        src="/github-mark-white.svg"
        alt="GitHub"
        width={32}
        height={32}
        className="mr-1"
      />
      GitHub
    </Button>
  );
};
