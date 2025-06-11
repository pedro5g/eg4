import { ApiProfile } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const data = useQuery({
    queryFn: ApiProfile,
    queryKey: ["user-profile"],
    staleTime: 0,
    retry: 2,
  });

  return {
    user: data.data?.profile ?? null,
    isLoading: data.isLoading,
  };
};
