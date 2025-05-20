import { ApiDeleteInvoice } from "@/api/endpoints";
import { Invoice } from "@/api/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export function ConfirmDeleteInvoice() {
  const { open, invoice, onClose } = useConfirmDeleteInvoice();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => ApiDeleteInvoice({ invoiceId: invoice.id }),
    onSuccess: async ({ ok }) => {
      if (ok) {
        window.toast.success("A fatura foi deletada");
        await queryClient.refetchQueries({
          queryKey: ["client-invoices", invoice.clientId],
        });
        onClose();
      }
    },
    onError: (error) => {
      console.error(error);
      window.toast.error("Um erro inesperado ocorreu, tente mais tarde");
    },
  });

  function handlerDelete() {
    if (isPending) return;
    mutate();
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente essa
            fatura.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              type="button"
              onClick={handlerDelete}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700">
              {isPending && <Loader2 className="animate-spin" />}
              {isPending ? "Deletando" : " Confirmar"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const useConfirmDeleteInvoice = () => {
  const [data, setData] = useQueryStates({
    alert: parseAsBoolean.withDefault(false),
    invoice: parseAsString.withDefault(""),
  });

  const invoice = (data.invoice
    ? JSON.parse(decodeURIComponent(data.invoice))
    : null) as unknown as Invoice;

  function onOpen(_data: Invoice) {
    setData(() => {
      return {
        alert: true,
        invoice: encodeURIComponent(JSON.stringify(_data)),
      };
    });
  }

  function onClose() {
    setData(() => {
      return {
        alert: false,
        invoice: "",
      };
    });
  }

  return {
    open: data.alert,
    invoice,
    onOpen,
    onClose,
  };
};
