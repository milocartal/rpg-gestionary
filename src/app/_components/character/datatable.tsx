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
import { Eye, FilePen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import {
  DataTableBase,
  DataTableColumnHeader,
} from "~/app/_components/data-table";

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

import type { CharacterWithAll } from "~/lib/models/Character";

interface CharacterDataTableProps {
  data: CharacterWithAll[];
  children?: React.ReactNode;
}

const columns: ColumnDef<CharacterWithAll>[] = [
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
    accessorFn: (row) => {
      return `${row.firstName} ${row.name}`;
    },
    header: "Nom",
    cell: (data) => {
      return (
        <div className="text-xs capitalize">{data.getValue() as string}</div>
      );
    },
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.age,
    id: "Âge",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Âge (ans)" />;
    },
    enableMultiSort: true,
    cell: (data) => {
      return (
        <div className="text-xs capitalize">{data.getValue() as number}</div>
      );
    },
  },
  {
    accessorFn: (row) => row.height,
    id: "Taille",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Taille (m)" />;
    },
    enableMultiSort: true,
    cell: (data) => {
      return (
        <div className="text-xs capitalize">{data.getValue() as number}</div>
      );
    },
  },
  {
    accessorFn: (row) => row.weight,
    id: "Masse",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Masse (kg)" />;
    },
    enableMultiSort: true,
    cell: (data) => {
      return (
        <div className="text-xs capitalize">{data.getValue() as number}</div>
      );
    },
  },
  {
    accessorFn: (row) => row.Modifiers.length,
    id: "Bonus",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Bonus" />;
    },
    enableMultiSort: true,
    cell: (data) => {
      return (
        <div className="text-xs capitalize">{data.getValue() as number}</div>
      );
    },
  },
  {
    accessorFn: (row) => row.createdAt,
    id: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Créé le" />;
    },
    cell: (data) => {
      const date = new Date(data.getValue() as string);
      return (
        <div className="text-xs">
          {date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
    enableHiding: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const CharacterDataTableCell = () => {
        const router = useRouter();
        const population = row.original;

        const deleteCharacter = api.population.delete.useMutation({
          onSuccess: () => {
            router.refresh();
            toast.success("Character supprimé");
          },
          onError: () => {
            toast.error("Une erreur est survenue");
          },
        });

        async function handleDelete() {
          try {
            await deleteCharacter.mutateAsync({ id: population.id });
          } catch (error) {
            console.error("Delete population error:", error);
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
                  href={`/populations/${population.slug}`}
                  variant={"icon"}
                  size={"icon"}
                  className="text-succes p-0"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="text-primary">Aperçu</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/populations/${population.slug}/edit`}
                  variant={"icon"}
                  size={"icon"}
                  className="text-primary p-0"
                >
                  <FilePen className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="text-primary">Modifier</TooltipContent>
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

      return <CharacterDataTableCell />;
    },
  },
];

const DataTableCharacterOne: React.FC<CharacterDataTableProps> = ({
  data,
  children,
}) => {
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

  /* const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => {
    return row.original.id;
  }); */

  return (
    <DataTableBase table={table} columns={columns} selection>
      {children}
      <Input
        placeholder="Chercher un personnage..."
        value={(table.getColumn("Nom")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("Nom")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </DataTableBase>
  );
};

export const DataTableCharacter = withSessionProvider(DataTableCharacterOne);
