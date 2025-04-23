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
import type { Sexe } from "@prisma/client";

interface SexeDataTableProps {
  data: Sexe[];
  children?: React.ReactNode;
}

const columns: ColumnDef<Sexe>[] = [
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const SexeDataTableCell = () => {
        const router = useRouter();
        const sexe = row.original;

        const deleteSexe = api.sexe.delete.useMutation({
          onSuccess: () => {
            router.refresh();
            toast.success("Sexe supprimé");
          },
          onError: () => {
            toast.error("Une erreur est survenue");
          },
        });

        async function handleDelete() {
          try {
            await deleteSexe.mutateAsync({ id: sexe.id });
          } catch (error) {
            console.error("Delete sexe error:", error);
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
                  href={`/sexe/${sexe.id}`}
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
                  href={`/sexe/${sexe.id}/edit`}
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

      return <SexeDataTableCell />;
    },
  },
];

const DataTableSexeOne: React.FC<SexeDataTableProps> = ({ data, children }) => {
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

  const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => {
    return row.original.id;
  });

  return (
    <DataTableBase table={table} columns={columns} selection>
      {children}
      <Input
        placeholder="Chercher un sexe..."
        value={(table.getColumn("Nom")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("Nom")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </DataTableBase>
  );
};

export const DataTableSexe = withSessionProvider(DataTableSexeOne);
