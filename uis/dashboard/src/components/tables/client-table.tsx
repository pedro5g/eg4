"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  DownloadIcon,
  GripVerticalIcon,
  MoreVerticalIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/api/types";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import {
  cn,
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatDate,
  formatPhone,
} from "@/lib/utils";
import { STATUS_MAP, STYLE_STATUS_MAP } from "@/constants";
import { useTableClientsQuery } from "@/hooks/use-table-clients-query";
import { mkConfig, generateCsv, download } from "export-to-csv";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "react-router";

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent">
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const columns: ColumnDef<Client>[] = [
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
          className="data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400"
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
          className="data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400"
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
          <span className="text-sm text-zinc-800 font-bold">{name}</span>
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
        <Badge
          variant="outline"
          className={cn(
            "px-3 border-2",
            STYLE_STATUS_MAP[row.original.status]
          )}>
          {STATUS_MAP[row.original.status]}
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
          <DropdownMenuItem>Arquivos</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function DraggableRow({ row }: { row: Row<Client> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

interface DataTableClientsProps {
  data: Client[];
  meta: {
    pageCount: number;
    total: number;
  };
}

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Tabela de clientes",
  title: "Clientes",
});

export function DataTableClients({
  data: initialData,
  meta,
}: DataTableClientsProps) {
  const [data, setData] = React.useState<Client[]>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { pagination, setPagination } = useTableClientsQuery();
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  React.useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const handleExportCSV = (data: any) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    pageCount: meta.pageCount,
    rowCount: meta.total,
    manualPagination: true,
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="px-3 py-4 border-2 border-zinc-500/40 text-zinc-600 cursor-pointer"
                variant="outline"
                size="sm">
                <ColumnsIcon className="text-zinc-600" />
                <span className="hidden lg:inline">Customize as colunas</span>
                <span className="lg:hidden">Colunas</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }>
                      {
                        {
                          taxId: "CPF/CNPJ",
                          name: "Nome",
                          state: "Estado",
                          status: "Status",
                        }[column.id]
                      }
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {data && data.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="ml-auto lg:flex px-3 py-4 border-2 border-zinc-500/40 text-zinc-600 cursor-pointer"
              onClick={() => {
                const data = table.getFilteredRowModel().rows.map((row) => {
                  return {
                    code: row.original.code,
                    nome: row.original.name,
                    email: row.original.email || "Email não informado",
                    telefone:
                      (row.original.phone &&
                        formatPhone(
                          row.original.areaCode + row.original.phone
                        )) ||
                      "Telefone não informado",
                    status: STATUS_MAP[row.original.status],
                    dd: row.original.areaCode || "Não informado",
                    cep:
                      (row.original.zipCode &&
                        formatCEP(row.original.zipCode)) ||
                      "Não informado",
                    endereço: row.original.address,
                    bairro: row.original.neighborhood,
                    cidade: row.original.city,
                    estado: row.original.state,
                    "cpf/cnpj":
                      (row.original.taxId &&
                        (row.original.taxId?.length === 11
                          ? formatCPF(row.original.taxId)
                          : formatCNPJ(row.original.taxId))) ||
                      "Não informado",
                    "Tipo do registro":
                      (row.original.taxId &&
                        (row.original.taxId?.length === 11
                          ? "Pessoa Física"
                          : "Pessoa Jurídica")) ||
                      "Não informado",
                    "Data de nascimento":
                      (row.original.openingDate &&
                        formatDate(row.original.openingDate)) ||
                      "Não informado",
                    "Data de abertura":
                      (row.original.openingDate &&
                        formatDate(row.original.openingDate)) ||
                      "Não informado",
                    "Nome fantasia":
                      (row.original.tradeName && row.original.tradeName) ||
                      "Não informado",
                  };
                });
                handleExportCSV(data);
              }}>
              <DownloadIcon className="mr-2 size-4" />
              Exportar como CSV
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}>
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-blue-100/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}>
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center">
                    Nenhum cliente encontrado {": ("}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
      <div className="flex items-center justify-between px-4 mt-3">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Linhas por pagina
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}>
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[2, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Pagina {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}>
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
