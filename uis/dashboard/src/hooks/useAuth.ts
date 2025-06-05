import { ApiProfile } from "@/api/endpoints";
import { isJavaVersion } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const data = useQuery({
    queryFn: ApiProfile,
    queryKey: ["user-profile"],
    staleTime: 0,
    retry: 2,
  });

  return {
    user: (isJavaVersion() ? data.data?.data : data.data?.profile) ?? null,
    isLoading: data.isLoading,
  };
};
