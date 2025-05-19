import { formatPhone, formatCurrency, cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale/pt-BR";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Client } from "@/api/types";
import { Logo } from "../logo";
import Barcode from "react-barcode";

interface InvoiceData {
  number: string;
  product: string;
  amount: string | null;
  issueDate: Date | string;
  dueDate: Date | string;
  client: Client | null;
  view?: "a4" | "default";
}

export function InvoicePdfTemplate({
  number,
  product,
  amount,
  issueDate,
  dueDate,
  client,
  view = "default",
}: InvoiceData) {
  return (
    <div
      className={cn(
        "mx-auto bg-white text-black",
        view === "default" && "w-full max-w-[794px]",
        view === "a4" && "w-[794px] h-[1133.8px]"
      )}>
      <Card
        data-view={view}
        className="border border-blue-100 shadow-lg h-fit pt-0 data-[view='default']:overflow-hidden data-[view='a4']:h-full">
        <CardHeader
          data-view={view}
          className="w-full bg-blue-500 data-[view='default']:py-4 py-15">
          <CardTitle className="[&>h1]:text-white">
            <Logo />
          </CardTitle>
          <CardDescription className="text-xs text-white">
            EG4 o melhor lugar para se fazer negocio!
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 py-2">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="bg-blue-100 rounded-full p-2">
                <FileText className="size-6 text-blue-500" />
              </div>
              <div className="text-right">
                <h3 className="text-xl font-semibold text-gray-900">Fatura</h3>
                <p className="text-sm text-gray-500">#{number}</p>
              </div>
            </div>
            {client ? (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="text-sm font-medium text-blue-700 mb-1">
                  PARA:
                </h4>
                <div className="text-sm font-medium">{client.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {client.address}
                </div>
                {client.email && (
                  <div className="text-xs text-gray-600">{client.email}</div>
                )}
                {client.phone && client.areaCode && (
                  <div className="text-xs text-gray-600">
                    {formatPhone(client.areaCode + client.phone)}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 text-center">
                <p className="text-sm text-blue-700">
                  Selecione um cliente para ver as informações de cobrança
                </p>
              </div>
            )}
            <Separator className="my-4 bg-blue-100" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Produto:</span>
                <span className="font-medium text-gray-900">{product}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Valor:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency((amount || 0.0).toString())}
                </span>
              </div>
            </div>
            <Separator className="my-4 bg-blue-100" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Data de emissão:</span>
                <span className="font-medium text-gray-900">
                  {issueDate
                    ? format(issueDate, "dd MMMM, yyyy", { locale: ptBR })
                    : "Not set"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Data de vencimento:</span>
                <span className="font-medium text-gray-900">
                  {dueDate
                    ? format(dueDate, "dd MMMM, yyyy", { locale: ptBR })
                    : "Not set"}
                </span>
              </div>
            </div>
            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total:</span>
                <span className="text-2xl font-bold text-blue-700">
                  {formatCurrency((amount || 0.0).toString())}
                </span>
              </div>
            </div>
            <div>
              <Barcode
                className="w-full h-20"
                value={`${import.meta.env.VITE_API_URL}/invoice/${number}/paid`}
              />
            </div>{" "}
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Obrigado por fazer negócios conosco!</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex items-center justify-center text-center">
            <p className="text-xs text-muted-foreground [&_span]:font-semibold">
              Problemas ? Fale conosco pelo <span>eg4@email.com</span> ou pelo{" "}
              <span>(15) 994455 8914</span>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
