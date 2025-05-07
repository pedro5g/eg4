import { ApiListClients } from "@/api/endpoints";
import { DataTableClients } from "@/components/tables/client-table";
import { FilterByStatus } from "@/components/tables/filter-by-status";
import { SearchClient } from "@/components/tables/serch-client";
import { useTableClientsQuery } from "@/hooks/use-table-clients-query";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
const statusSchema = z.enum(["ACTIVE", "INACTIVE", "BLOCKED", "PENDING"]);
export const listClientsSchema = z.object({
  page: z.coerce
    .number()
    .transform((value) => {
      if (value <= 0) return 1;
      return value;
    })
    .optional()
    .default(1),
  take: z.coerce
    .number()
    .transform((value) => {
      if (value <= 0) return 10;
      return value;
    })
    .optional()
    .default(10),
  q: z.string().trim().optional(),
  s: statusSchema.optional(),
});

export function ClientsTable() {
  return (
    <div className="w-full h-full space-y-4 my-5">
      <div className="w-full">
        <h3 className="text-zinc-800 font-bold tracking-tight text-4xl text-zinc-80">
          Clientes
        </h3>
      </div>
      <div className="flex items-center justify-between max-w-full">
        <FilterByStatus />
        <SearchClient />
      </div>
      <LoadingTable />
    </div>
  );
}

const LoadingTable = () => {
  const { pagination, q, s } = useTableClientsQuery();
  const { data, isLoading } = useQuery({
    queryFn: () =>
      ApiListClients({
        page: pagination.pageIndex,
        take: pagination.pageSize,
        q,
        s: s?.join(","),
      }),
    queryKey: ["list-clients", pagination.pageIndex, pagination.pageSize, q, s],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <p>Carregando ...</p>;

  return (
    <DataTableClients
      data={data?.data.items || []}
      meta={{
        pageCount: data?.data.meta.pageCount || 1,
        total: data?.data.meta.total || 1,
      }}
    />
  );
};
