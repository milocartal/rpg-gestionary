"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Ban, FilePen, Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { DataTableBase } from "~/app/_components/data-table";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { Link } from "~/app/_components/ui/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/app/_components/ui/tooltip";
import { api } from "~/trpc/react";
import { withSessionProvider } from "~/utils/withSessionProvider";
import { Checkbox } from "~/app/_components/ui/checkbox";
import type { Item } from "@prisma/client";
import { ItemTypeDisplay } from "~/lib/models/Item";
import { ItemBadge } from "./badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";

interface ItemDataTableProps {
  data: Item[];
  children?: React.ReactNode;
}

const columns: ColumnDef<Item>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row,
    header: "Sprite",
    cell: (data) => {
      const item = data.getValue() as Item;
      const sprite = item.sprite;
      return (
        <div className="flex items-center">
          {sprite ? (
            <Avatar>
              <AvatarImage src={sprite} alt={item.name} />
              <AvatarFallback>OBJ</AvatarFallback>
            </Avatar>
          ) : (
            <Ban className="h-6 w-6" />
          )}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.name,
    header: "Nom",
    cell: (data) => {
      return (
        <div className="text-xs capitalize">{data.getValue() as string}</div>
      );
    },
  },
  {
    accessorFn: (row) => row.description,
    header: "Description",
    cell: (data) => {
      return <div className="text-xs">{data.getValue() as string}</div>;
    },
  },

  {
    accessorFn: (row) => row.weight,
    header: "Poids",
    cell: (data) => {
      if (data.getValue() === null || data.getValue() === undefined) {
        return <div className="text-xs">N/A</div>;
      }
      if (typeof data.getValue() !== "number") {
        return <div className="text-xs">Invalid weight</div>;
      }
      return <div className="text-xs">{data.getValue() as number} kg</div>;
    },
  },
  {
    accessorFn: (row) => row.value,
    header: "Valeur",
    cell: (data) => {
      if (data.getValue() === null || data.getValue() === undefined) {
        return <div className="text-xs">N/A</div>;
      }
      if (typeof data.getValue() !== "number") {
        return <div className="text-xs">Invalid value</div>;
      }
      const value = data.getValue() as number;
      if (value < 0) {
        return <div className="text-xs text-red-500">Valeur invalide</div>;
      }
      if (value === 0) {
        return <div className="text-xs">Gratuit</div>;
      }
      if (value > 1000000) {
        return <div className="text-xs text-red-500">Valeur trop élevée</div>;
      }
      return <div className="text-xs">{value} €</div>;
    },
  },
  {
    accessorFn: (row) => row.isConsumable,
    header: "Consommable",
    cell: ({ getValue }) => {
      const isConsumable = getValue() as boolean;
      return (
        <Checkbox
          checked={isConsumable}
          disabled
          className="translate-y-[2px]"
        />
      );
    },
  },
  {
    accessorFn: (row) => ItemTypeDisplay[row.type],
    header: "Type",
    cell: (data) => {
      return <ItemBadge item={data.row.original} />;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ItemDataTableCell = () => {
        const router = useRouter();
        const item = row.original;

        const deleteItem = api.item.delete.useMutation({
          onSuccess: () => {
            router.refresh();
            toast.success("Compétence de base supprimée");
          },
          onError: () => {
            toast.error("Une erreur est survenue");
          },
        });

        async function handleDelete() {
          try {
            await deleteItem.mutateAsync({ id: item.id });
          } catch (error) {
            console.error("Delete item error:", error);
            toast.error(
              error instanceof Error
                ? error.message
                : "Une erreur est survenue",
            );
          }
        }

        return (
          <section className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/items/${item.slug}`}
                  variant={"icon"}
                  size={"icon"}
                  className="text-primary p-0"
                >
                  <FilePen className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="text-white">Modifier</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="icon"
                  size={"icon"}
                  className="text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-destructive text-primary-foreground border-none">
                Supprimer
              </TooltipContent>
            </Tooltip>
          </section>
        );
      };

      return <ItemDataTableCell />;
    },
  },
];

const DataTableItemOne: React.FC<ItemDataTableProps> = ({ data, children }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    getRowId: (row) => row.id,
  });

  /*  const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => {
    return row.original.id;
  }); */

  return (
    <DataTableBase table={table} columns={columns} selection>
      {children}
      <Input
        placeholder="Chercher une compétence..."
        value={(table.getColumn("Nom")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("Nom")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </DataTableBase>
  );
};

export const DataTableItem = withSessionProvider(DataTableItemOne);
