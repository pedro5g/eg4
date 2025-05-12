import { DownloadIcon, Loader } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { FilterByStatus } from "./filter-by-status";
import { SearchClient } from "./search-client";
import { useDataExport } from "@/hooks/use-data-export";
import { exportAllClientsEndpoint } from "@/api/endpoints";

export const TableWrapper = ({ children }: { children: React.ReactNode }) => {
  const { exportData, isExporting } = useDataExport();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Clientes</CardTitle>
        <CardDescription>Encontre todos os seus clientes aqui</CardDescription>
        <div className="w-full flex items-center gap-2">
          <FilterByStatus />
          <SearchClient />

          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              className=" lg:flex px-3 py-5 rounded-sm border-2 border-zinc-500/40 text-zinc-600 cursor-pointer"
              onClick={() =>
                exportData({
                  endpoint: exportAllClientsEndpoint,
                  format: "xlsx",
                })
              }>
              {!isExporting ? (
                <DownloadIcon className="mr-2 size-4" />
              ) : (
                <Loader className="mr-2 size-4 animate-spin" />
              )}
              Exportar todos os clientes
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          Você pode filtrar os cliente pelo seu status, ou se preferir pode
          pesquisar, usando o,
          <b> nome, email, cidade, cpf/cnpj ou o códio do cliente.</b>
        </p>
      </CardHeader>
      <Separator />
      <CardContent>{children}</CardContent>
    </Card>
  );
};
