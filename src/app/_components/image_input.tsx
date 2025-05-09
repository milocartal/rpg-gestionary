"use client";

import { FilePlus } from "lucide-react";
import React, { type CSSProperties } from "react";
import { type DropTargetMonitor, useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

import CustomImage from "~/app/_components/image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";
import { Button } from "~/app/_components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/app/_components/ui/drawer";
import { Input } from "~/app/_components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/app/_components/ui/tooltip";

const style: CSSProperties = {
  display: "flex",
};

const hiddenStyle: CSSProperties = {
  display: "none",
};

interface ImageInputProps {
  dref: React.ForwardedRef<HTMLInputElement>;
  image?: string;
}

export const ImageInput: React.FC<ImageInputProps> = ({ dref, image }) => {
  const [picture, setPicture] = React.useState<string>(image ?? "");
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      async drop(item: { files: File[] }) {
        await handleDrop(item.files[0]!);
      },

      collect: (monitor: DropTargetMonitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const i = event.target.files[0];

      setPicture(URL.createObjectURL(i));
      setFileName(i.name);
    }
  };

  const isActive = canDrop && isOver;

  async function handleDrop(file: File) {
    if (dref && "current" in dref && dref.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      dref.current.files = dataTransfer.files;
    }
    setPicture(URL.createObjectURL(file));
    setFileName(file.name);
  }

  const handleClick = () => {
    if (dref && "current" in dref && dref.current) {
      dref.current.click();
    }
  };

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className="flex h-auto items-center justify-center gap-2"
    >
      <TooltipProvider>
        <Tooltip>
          <Drawer>
            <TooltipTrigger asChild>
              <DrawerTrigger asChild>
                <Avatar className="h-14 w-14">
                  <AvatarImage src={picture} />
                  <AvatarFallback>NP</AvatarFallback>
                </Avatar>
              </DrawerTrigger>
            </TooltipTrigger>
            <DrawerContent className="flex items-center justify-center">
              <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center">
                <DrawerHeader className="w-full">
                  <DrawerTitle>
                    Aperçu - {fileName ?? "Aucune image choisie"}
                  </DrawerTitle>
                  <DrawerDescription className="text-muted">
                    Aperçu de l&apos;image donnée
                  </DrawerDescription>
                </DrawerHeader>

                <CustomImage
                  src={picture ?? ""}
                  alt={fileName ?? ""}
                  width={300}
                  height={300}
                  className="rounded-lg p-2"
                />
                <DrawerFooter className="w-full">
                  <DrawerClose asChild>
                    <Button variant={"outline"} className="w-full">
                      Quitter
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
          <TooltipContent>Aperçu de l&apos;image</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="relative flex h-40 w-full flex-col items-center justify-center gap-1">
        <Input
          type="file"
          accept="image/*"
          onChange={handleChange}
          ref={dref}
          className="hidden"
        />
        <div
          onClick={handleClick}
          className="border-muted flex h-full w-full flex-col items-center justify-center rounded-md border border-dashed p-4 hover:cursor-pointer"
        >
          {fileName && <p className="font-bold">{fileName}</p>}
          <p>Déposer ou cliquez pour ajouter une image</p>
        </div>
        <div
          hidden={!isActive}
          className={`bg-secondary border-primary absolute top-0 right-0 bottom-0 left-0 z-10 flex items-center justify-center rounded-md border p-2`}
          style={isActive ? style : hiddenStyle}
        >
          <FilePlus className="text-text h-8 w-8" />
        </div>
      </div>
    </div>
  );
};
