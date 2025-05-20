import { Invoice, Client } from "@/api/types";
import { Card } from "@/components/ui/card";
import { useGenPdf } from "@/hooks/use-gen-pdf";
import { cn, formatCurrency, getDueDays } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  Barcode,
  ArrowRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Button } from "@/components/ui/button";
import { InvoiceModal } from "@/components/modals/invoice-modal";
import { useConfirmDeleteInvoice } from "@/components/modals/confirm-delete-invoice";

interface InvoiceCardProps {
  invoice: Invoice;
  client: Client;
  onEdit: () => void;
}

export const InvoiceCard = ({ invoice, client, onEdit }: InvoiceCardProps) => {
  const { handlerDownloadPdf, PdfTemplate, PdfTemplateHidden } = useGenPdf({
    client,
    invoice: {
      product: invoice.product,
      amount: invoice.amount.toString(),
      number: invoice.number,
      dueDate: invoice.dueDate,
      issueDate: invoice.issueDate,
    },
  });
  const { onOpen } = useConfirmDeleteInvoice();

  return (
    <>
      <Card
        key={invoice.id}
        className="group overflow-hidden transition-all hover:shadow-md py-2">
        <div className="relative">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center mr-3",
                    invoice.status === "PAID"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : invoice.status === "CANCELED"
                      ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  )}>
                  {invoice.status === "PAID" ? (
                    <CheckCircleIcon className="h-4 w-4" />
                  ) : invoice.status === "CANCELED" ? (
                    <XCircleIcon className="h-4 w-4" />
                  ) : (
                    <ClockIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {
                      {
                        PAID: "status pago",
                        PENDING: "status pendente",
                        CANCELED: "status cancelado",
                      }[invoice.status]
                    }
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-sm inline-flex gap-1 items-center">
                    <Barcode className="size-4" />
                    {invoice.number}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {invoice.product}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-base">
                  {formatCurrency(invoice.amount.toString())}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getDueDays(invoice.dueDate)}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <div className="text-xs text-muted-foreground">
                <p>
                  Emitida:{" "}
                  {format(invoice.issueDate, "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </p>
                <p>
                  Vencimento:{" "}
                  {format(invoice.dueDate, "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div className="flex items-center">
                <InvoiceModal
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      Visualizar
                      <ArrowRightIcon className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  }>
                  <PdfTemplate />
                </InvoiceModal>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontalIcon className="h-3.5 w-3.5" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={handlerDownloadPdf}>
                      Download do PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onOpen(invoice)}
                      className="text-red-600 dark:text-red-400">
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <PdfTemplateHidden />
    </>
  );
};
