"use client";

import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "~/app/_components/ui/button";
import { cn } from "~/lib/utils";

import { SidebarTrigger, useSidebar } from "../ui/sidebar";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly title: string;
  readonly back?: boolean;
  readonly children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  back,
  children,
  className,
}) => {
  const router = useRouter();
  const { open, isMobile } = useSidebar();
  return (
    <header
      className={cn(
        `fixed z-10 flex h-20 w-full items-center justify-between bg-white px-4 shadow-[0_10px_13px_-15px_rgba(0,0,0,0.3)]`,
        isMobile
          ? "w-full"
          : open
            ? "w-[calc(100%-16rem)]"
            : "w-[calc(100%-3rem)]",
        className,
      )}
    >
      <div className="mr-2 flex items-center gap-2">
        {isMobile ? (
          <SidebarTrigger />
        ) : (
          back && (
            <Button
              variant={"default"}
              className="flex gap-2"
              size={"sm"}
              onClick={() => router.back()}
            >
              <MoveLeft className="h-3 w-3" />
              Retour
            </Button>
          )
        )}
        <h1 className="text-text ml-2 text-sm font-bold xl:text-2xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center justify-end gap-4">{children}</div>
    </header>
  );
};
