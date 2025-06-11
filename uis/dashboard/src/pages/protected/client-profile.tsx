import { ApiClientProfile } from "@/api/endpoints";
import { useParams } from "react-router";
import { FormProfile } from "@/components/forms/form-profile.tsx/edit-client-profile-form";
import { useQuery } from "@tanstack/react-query";
import { ClientProfileSkeleton } from "@/components/skeleton-loader/client-profile-skeleton";

export const ClientProfile = () => {
  const clientCode = useParams().clientCode;
  if (!clientCode) return (window.location.href = "/client/table");

  const { data, isLoading } = useQuery({
    queryFn: () => ApiClientProfile(clientCode),
    queryKey: ["client-profile", clientCode],
    refetchOnMount: false,
  });

  const client = data?.client;
  if (isLoading || !client) return <ClientProfileSkeleton />;

  return (
    <div className="container flex flex-1 flex-col">
      <FormProfile client={client} />
    </div>
  );
};
