import { ApiListClients } from "@/api/endpoints";
import { DataTableClients } from "@/components/tables/client-table";
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
  const { data, isLoading } = useQuery({
    queryFn: () => ApiListClients({}),
    queryKey: ["list-clients"],
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }
  console.log(data?.data.items);
  return <DataTableClients data={data?.data.items || []} />;
}
