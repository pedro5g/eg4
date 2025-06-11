import { ApiListStores } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";

export function useGetStores() {
  const { data, isLoading } = useQuery({
    queryFn: ApiListStores,
    queryKey: ["store-list"],
  });

  return {
    isLoading,
    data,
  };
}
