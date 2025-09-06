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
import { type UniverseWithAll } from "~/lib/models/Univers";
import { api } from "~/trpc/react";
import { withSessionProvider } from "~/utils/withSessionProvider";
import { Checkbox } from "~/app/_components/ui/checkbox";

interface UniversDataTableProps {
  data: UniverseWithAll[];
  children?: React.ReactNode;
}

const columns: ColumnDef<UniverseWithAll>[] = [
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
    accessorFn: (row) => row.name,
    header: "Nom",
    cell: (data) => {
      return (
        <div className="text-xs capitalize">{data.getValue() as string}</div>
      );
    },
  },
  {
    accessorFn: (originalRow) => {
      return originalRow.Users.length;
    },
    id: "Utilisateurs",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Utilisateurs" />;
    },
    cell: (info) => {
      const nb = info.getValue() as number;
      return <div className="text-xs">{nb}</div>;
    },
  },
  {
    accessorFn: (originalRow) => {
      return originalRow.Stories.length;
    },
    id: "Histoires",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Histoires" />;
    },
    cell: (info) => {
      const nb = info.getValue() as number;
      return <div className="text-xs">{nb}</div>;
    },
  },
  {
    accessorFn: (originalRow) => {
      return originalRow.Genders.length;
    },
    id: "Genders",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Genders" />;
    },
    cell: (info) => {
      const nb = info.getValue() as number;
      return <div className="text-xs">{nb}</div>;
    },
  },
  {
    accessorFn: (originalRow) => {
      return originalRow.Species.length;
    },
    id: "Espèces",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Espèces" />;
    },
    cell: (info) => {
      const nb = info.getValue() as number;
      return <div className="text-xs">{nb}</div>;
    },
  },
  {
    accessorFn: (originalRow) => {
      return originalRow.Populations.length;
    },
    id: "Populations",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Populations" />;
    },
    cell: (info) => {
      const nb = info.getValue() as number;
      return <div className="text-xs">{nb}</div>;
    },
  },
  {
    accessorFn: (originalRow) => {
      return originalRow.BaseSkills.length;
    },
    id: "Compétences de base",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Compétences de base" />
      );
    },
    cell: (info) => {
      const nb = info.getValue() as number;
      return <div className="text-xs">{nb}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const UniversDataTableCell = () => {
        const router = useRouter();
        const univers = row.original;

        const deleteUnivers = api.universe.delete.useMutation({
          onSuccess: () => {
            router.refresh();
            toast.success("Univers supprimé");
          },
          onError: () => {
            toast.error("Une erreur est survenue");
          },
        });

        async function handleDelete() {
          try {
            await deleteUnivers.mutateAsync({ id: univers.id });
          } catch (error) {
            console.error("Delete univers error:", error);
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
                  href={`/universes/${univers.slug}`}
                  variant={"icon"}
                  size={"icon"}
                  className="text-succes p-0"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Aperçu</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/universes/${univers.slug}/edit`}
                  variant={"icon"}
                  size={"icon"}
                  className="text-primary p-0"
                >
                  <FilePen className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Modifier</TooltipContent>
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

      return <UniversDataTableCell />;
    },
  },
];

const DataTableUniversOne: React.FC<UniversDataTableProps> = ({
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
  });
 */
  return (
    <DataTableBase table={table} columns={columns} selection>
      {children}
      <Input
        placeholder="Chercher un univers..."
        value={(table.getColumn("Nom")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("Nom")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </DataTableBase>
  );
};

export const DataTableUnivers = withSessionProvider(DataTableUniversOne);
