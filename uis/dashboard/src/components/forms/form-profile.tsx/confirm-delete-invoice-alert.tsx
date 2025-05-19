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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface ConfirmDeleteInvoiceProps {
  invoice: Invoice;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function ConfirmDeleteInvoice({
  invoice,
  open,
  setOpen,
}: ConfirmDeleteInvoiceProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => ApiDeleteInvoice({ invoiceId: invoice.id }),
    onSuccess: async ({ ok }) => {
      if (ok) {
        window.toast.success("Fatura deletada!");
        await queryClient.refetchQueries({
          queryKey: ["client-invoices", invoice.clientId],
        });
        setOpen(false);
      }
    },
    onError: (error) => {
      console.error(error);
      window.toast.error("Um inesperado ocorreu, tente mais tarde");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente está
            fatura.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => {
              if (isPending) return;
              mutate();
            }}
            className="h-8 px-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
            {isPending && <Loader2 className="animate-spin" />}
            {isPending ? "Deletando" : "Continuar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
