import { ApiDeleteClient } from "@/api/endpoints";
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
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface ConfirmDeleteClientProps {
  code: string;
}

export function ConfirmDeleteClient({ code }: ConfirmDeleteClientProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => ApiDeleteClient({ code }),
    onSuccess: async ({ ok }) => {
      if (ok) {
        window.toast.success("Cliente deletado");
        await queryClient.refetchQueries({
          queryKey: ["list-clients"],
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
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full hover:bg-red-400">
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="inline-flex items-center gap-2 text-red-500 text-xl">
            Você tem certeza ? <AlertCircle />
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            cliente de nossa base de dados.
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
