import { DownloadIcon } from "lucide-react";
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
  const { exportData, isExporting, progress, cancelExport } = useDataExport();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Clientes</CardTitle>
        <CardDescription>Encontre todos os seus clientes aqui</CardDescription>
        <div className="w-full flex md:flex-row flex-col md:items-center gap-2 ">
          <FilterByStatus />
          <SearchClient />

          <div className="md:ml-auto">
            {isExporting ? (
              <Button
                variant="outline"
                size="sm"
                className=" lg:flex px-3 py-5 rounded-sm border-2 border-zinc-500/40 text-zinc-600 dark:text-zinc-200 cursor-pointer"
                onClick={cancelExport}>
                <div className="flex select-none relative text-slate-500 items-center justify-center">
                  <div
                    className="radial-progress size-8"
                    style={{
                      //@ts-ignore
                      "--value": progress.percentage,
                      "--progress-color": "var(--color-blue-500)",
                      "--thickness": " 0.3rem",
                    }}></div>
                  <div className="absolute font-bold text-[8px]">
                    {progress.percentage}%
                  </div>
                </div>
                Cancelar download
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="lg:flex px-3 py-5 rounded-sm border-2 border-zinc-500/40 text-zinc-600 dark:text-zinc-200 cursor-pointer"
                onClick={() =>
                  exportData({
                    endpoint: exportAllClientsEndpoint,
                    format: "xlsx",
                    filename: "clientes",
                    title: "Lista de Clientes",
                  })
                }>
                <DownloadIcon className="mr-2 size-4" />
                Exportar todos os clientes
              </Button>
            )}
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
