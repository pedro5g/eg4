import { ApiListClients } from "@/api/endpoints";
import { DataTableClients } from "@/components/tables/client-table";
import { TableWrapper } from "@/components/tables/table-wrapper";
import { useTableClientsQuery } from "@/hooks/use-table-clients-query";
import { useQuery } from "@tanstack/react-query";

export function ClientsTable() {
  return (
    <div className="w-full h-full my-5">
      <TableWrapper>
        <LoadingTable />
      </TableWrapper>
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
