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
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface ConfirmDeleteInvoiceProps {
  invoice: Invoice;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ConfirmDeleteInvoice({
  open,
  setOpen,
  invoice,
}: ConfirmDeleteInvoiceProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => ApiDeleteInvoice({ invoiceId: invoice.id }),
    onSuccess: async ({ ok }) => {
      if (ok) {
        window.toast.success("A fatura foi deletada");
        await queryClient.refetchQueries({
          queryKey: ["client-invoices", invoice.clientId],
        });
        setOpen(false);
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="inline-flex items-center gap-2 text-red-500 text-xl">
            Você tem certeza absoluta? <AlertCircle />
          </AlertDialogTitle>
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
