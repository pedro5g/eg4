import { ApiDeleteClientFile } from "@/api/endpoints";
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
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { useCallback } from "react";
import { z } from "zod";

export function ConfirmDeleteFile() {
  const queryClient = useQueryClient();
  const { open, close, fileId, clientId } = useConfirmDeleteFiles();

  const { mutate, isPending } = useMutation({
    mutationFn: () => ApiDeleteClientFile({ id: fileId }),
    onSuccess: async ({ ok }) => {
      if (ok) {
        window.toast.success("Arquivo deletado");
        await queryClient.refetchQueries({
          queryKey: ["client-files", clientId],
        });
        close();
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
    <AlertDialog open={open} onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="inline-flex items-center gap-2 text-red-500 text-xl">
            Você tem certeza ? <AlertCircle />
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            arquivo.
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

export const useConfirmDeleteFiles = () => {
  const [datas, setDatas] = useQueryStates({
    open: parseAsBoolean.withDefault(false),
    fileTarget: parseAsString.withDefault(""),
    cTarget: parseAsString.withDefault(""),
  });

  const alert = useCallback((fileId: string, clientId: string) => {
    const { success } = z.string().trim().cuid().safeParse(fileId);
    if (!success) return;

    setDatas(() => {
      return {
        open: true,
        fileTarget: fileId,
        cTarget: clientId,
      };
    });
  }, []);

  const close = useCallback(() => {
    setDatas(() => {
      return {
        open: false,
        fileTarget: "",
        cTarget: "",
      };
    });
  }, []);

  const open = datas.open;
  const fileId = datas.fileTarget;
  const clientId = datas.cTarget;

  return {
    open,
    fileId,
    clientId,
    alert,
    close,
  };
};
