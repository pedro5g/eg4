import { ApiListClients } from "@/api/endpoints";
import { TableSkeleton } from "@/components/skeleton-loader/table-skeleton";
import { DataTableClients } from "@/components/tables/client-table";
import { TableWrapper } from "@/components/tables/table-wrapper";
import { useTableClientsQuery } from "@/hooks/use-table-clients-query";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

export function ClientsTable() {
  return (
    <>
      <Helmet title="Clientes" />
      <div className="w-full h-full my-5">
        <TableWrapper>
          <LoadingTable />
        </TableWrapper>
      </div>
    </>
  );
}

const LoadingTable = () => {
  const { pagination, q, s } = useTableClientsQuery();
  const { data, isLoading, isPending } = useQuery({
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

  if (isLoading) return <TableSkeleton columns={5} rows={10} />;

  console.log(data);

  return (
    <DataTableClients
      data={data?.data.items || []}
      meta={{
        pageCount: data?.data.meta.pageCount || 1,
        total: data?.data.meta.total || 1,
      }}
      isPending={isPending}
    />
  );
};
