import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Card } from "../ui/card";
import { cn, formatCurrency, getDueDays } from "@/lib/utils";
import {
  Barcode,
  CheckCircleIcon,
  ClockIcon,
  Loader2,
  XCircleIcon,
} from "lucide-react";
import { ptBR } from "date-fns/locale/pt-BR";
import { format } from "date-fns";
import { Logo } from "../logo";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiCanceledInvoice, ApiPaidInvoice } from "@/api/endpoints";
import { Invoice } from "@/api/types";

interface EditInvoiceModelProps {
  open: boolean;
  setIsOpen: (value: boolean) => void;
  invoice: Invoice;
}

export const EditInvoiceModel = ({
  open,
  setIsOpen,
  invoice,
}: EditInvoiceModelProps) => {
  const queryClient = useQueryClient();

  const { mutate: paidInvoiceMutate, isPending: paidInvoiceIsPending } =
    useMutation({
      mutationFn: () => ApiPaidInvoice({ number: invoice.number }),
      onSuccess: async ({ ok }) => {
        if (ok) {
          window.toast.success("A fatura foi marcada como paga");
          await queryClient.refetchQueries({
            queryKey: ["client-invoices", invoice.clientId],
          });
          setIsOpen(false);
        }
      },
      onError: (error) => {
        console.error(error);
        window.toast.error("Um inesperado ocorreu, tente mais tarde");
      },
    });

  const {
    mutate: cancelateInvoiceMutate,
    isPending: canceledInvoiceIsPending,
  } = useMutation({
    mutationFn: () => ApiCanceledInvoice({ number: invoice.number }),
    onSuccess: async ({ ok }) => {
      if (ok) {
        window.toast.success("A fatura foi cancelada");
        await queryClient.refetchQueries({
          queryKey: ["client-invoices", invoice.clientId],
        });
        setIsOpen(false);
      }
    },
    onError: (error) => {
      console.error(error);
      window.toast.error("Um inesperado ocorreu, tente mais tarde");
    },
  });

  return (
    <Dialog modal open={open} onOpenChange={setIsOpen}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        aria-describedby="edite sua fatura aqui"
        className="overflow-hidden px-0 pt-0">
        <DialogHeader className="bg-blue-500 rounded-t-lg px-2 py-5 [&>h1]:text-white">
          <DialogTitle asChild>
            <Logo />
          </DialogTitle>
          <DialogDescription className="text-white">
            Edite a fatura aqui
          </DialogDescription>
        </DialogHeader>
        <div className="px-2 my-4">
          <Card className="group overflow-hidden transition-all hover:shadow-md py-2">
            <div className="relative">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center mr-3",
                        invoice?.status === "PAID"
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : invoice?.status === "CANCELED"
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      )}>
                      {invoice?.status === "PAID" ? (
                        <CheckCircleIcon className="h-4 w-4" />
                      ) : invoice?.status === "CANCELED" ? (
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
                      {formatCurrency(invoice?.amount.toString())}
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
                  <div />
                </div>
              </div>
            </div>
          </Card>
        </div>
        <DialogFooter className="px-2">
          {invoice.status === "PENDING" && (
            <div className="w-full inline-flex items-center justify-end gap-4">
              <Button
                disabled={paidInvoiceIsPending || canceledInvoiceIsPending}
                onClick={() => {
                  if (paidInvoiceIsPending || canceledInvoiceIsPending) return;
                  cancelateInvoiceMutate();
                }}
                type="button"
                variant="destructive">
                {canceledInvoiceIsPending && (
                  <Loader2 className="animate-spin" />
                )}
                Cancelar fatura
              </Button>
              <Button
                disabled={paidInvoiceIsPending || canceledInvoiceIsPending}
                onClick={() => {
                  if (paidInvoiceIsPending || canceledInvoiceIsPending) return;
                  paidInvoiceMutate();
                }}
                className="bg-green-600 hover:bg-green-700"
                type="button">
                {paidInvoiceIsPending && <Loader2 className="animate-spin" />}
                Pagar fatura
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
