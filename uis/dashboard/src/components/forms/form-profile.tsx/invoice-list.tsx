import { ApiListClientInvoices } from "@/api/endpoints";
import { Client } from "@/api/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { InvoiceCard } from "./invoice-card";
import { InvoiceCardSkeleton } from "../../skeleton-loader/invoice-card-skeleton";

interface InvoiceListProps {
  client: Client;
}

export const InvoiceList = ({ client }: InvoiceListProps) => {
  const navigate = useNavigate();

  const { data, isPending } = useQuery({
    queryFn: () => ApiListClientInvoices({ clientId: client.id }),
    queryKey: ["client-invoices", client.id],
  });
  return (
    <Card className="md:col-span-2 max-h-svh">
      <CardHeader>
        <CardTitle className="text-2xl">Faturas do cliente</CardTitle>
        <CardDescription className="text-xs">
          Todas as faturas do cliente são listadas aqui
        </CardDescription>
        <Button
          size="sm"
          onClick={() => {
            navigate(`/invoice/${client.code}`);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white">
          Cadastrar Fatura
        </Button>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className=" w-full space-y-2 max-h-[450px] scroll-py-1 overflow-x-hidden overflow-y-auto">
          {isPending ? (
            Array.from({ length: 8 }).map((_, i) => (
              <InvoiceCardSkeleton key={`invice_skeleton_${i}`} />
            ))
          ) : data?.invoices?.length === 0 ? (
            <div>
              <p>Nenhuma fatura cadastrada</p>
            </div>
          ) : (
            (data?.invoices || []).map((invoice) => (
              <InvoiceCard key={invoice.id} client={client} invoice={invoice} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
