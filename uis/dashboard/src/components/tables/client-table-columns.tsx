import { Client } from "@/api/types";
import { ColumnDef } from "@tanstack/react-table";
import { DragHandle } from "./table-drag-components";
import { Checkbox } from "../ui/checkbox";
import { formatCNPJ, formatCPF, formatPhone } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { STATUS_MAP } from "@/constants";
import { STATUS_ICON_MAP } from "@/constants/status-options";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { TableSheet } from "./table-sheet";
import { ConfirmDeleteClient } from "../modals/confirm-delete-client";

export const columns: ColumnDef<Client>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          className="data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400 cursor-pointer"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          className="data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400 cursor-pointer"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      const { name, email, areaCode, phone } = row.original;

      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-800 font-bold [&>a]:hover:underline underline-offset-2 ">
            <Link to={`/clients/${row.original.code}`}>{name}</Link>
          </span>
          {email && (
            <span className="text-xs text-zinc-500 font-light leading-1">
              {email}
            </span>
          )}
          {phone && areaCode && (
            <span className="text-xs text-zinc-500 font-light">
              {formatPhone(areaCode + phone)}
            </span>
          )}
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "taxId",
    header: "CPF/CNPj",
    cell: ({ row }) => {
      const { taxId } = row.original;

      return (
        <div className="px-1.5">
          {taxId ? (
            <span className="text-sm leading-1 text-zinc-800 font-medium tracking-tight">
              {taxId.length === 11 ? formatCPF(taxId) : formatCNPJ(taxId)}
            </span>
          ) : (
            <span className="text-sm leading-1 text-zinc-600 font-medium tracking-wider">
              Não informado
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => {
      const { address, state } = row.original;

      return (
        <div className="flex flex-col ">
          <span className=" text-zinc-800 font-semibold text-sm">
            {state.toUpperCase()}
          </span>
          <span className=" text-zinc-600 font-light  text-xs">{address}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-4">
          {STATUS_MAP[row.original.status]}
          {STATUS_ICON_MAP[row.original.status]}
        </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted cursor-pointer"
            size="icon">
            <MoreVerticalIcon />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>
            <Link to={`/clients/${row.original.code}`}>Perfil do cliente</Link>
          </DropdownMenuItem>
          <ConfirmDeleteClient code={row.original.code} />
          {import.meta.env.VITE_APP_VERSION !== "aula" && (
            <TableSheet client={row.original}>
              <Button
                variant="outline"
                size={"sm"}
                className="cursor-pointer w-full border-none font-normal focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                Arquivos
              </Button>
            </TableSheet>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
