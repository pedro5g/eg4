import { ApiClientProfile } from "@/api/endpoints";
import { useParams } from "react-router";
import { FormProfile } from "@/components/forms/form-profile.tsx";
import { useQuery } from "@tanstack/react-query";

export const ClientProfile = () => {
  const clientCode = useParams().clientCode;
  if (!clientCode) return (window.location.href = "/client/table");

  const { data, isLoading } = useQuery({
    queryFn: () => ApiClientProfile(clientCode),
    queryKey: ["client-profile", clientCode],
    refetchOnMount: false,
  });

  if (isLoading || !data?.client) return <p>Carregando ...</p>;

  const { client } = data;

  return (
    <div className="w-full container h-full space-y-4">
      <div className="w-full py-4">
        <h3 className="text-4xl font-bold text-zinc-800">Perfil do cliente</h3>
      </div>
      <FormProfile client={client} />
    </div>
  );
};
