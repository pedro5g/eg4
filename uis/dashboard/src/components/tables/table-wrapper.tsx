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

export const TableWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Clientes</CardTitle>
        <CardDescription>Encontre todos os seus clientes aqui</CardDescription>
        <div className="flex items-center gap-2">
          <FilterByStatus />
          <SearchClient />
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
