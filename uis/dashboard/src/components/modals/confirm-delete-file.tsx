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
  const { openConfirmDeleteFile, onCloseConfirmDeleteFile, fileId, clientId } =
    useConfirmDeleteFile();

  const { mutate, isPending } = useMutation({
    mutationFn: () => ApiDeleteClientFile({ id: fileId }),
    onSuccess: async ({ ok }) => {
      if (ok) {
        window.toast.success("Arquivo deletado");
        await queryClient.refetchQueries({
          queryKey: ["client-files", clientId],
        });
        onCloseConfirmDeleteFile();
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
    <AlertDialog
      open={openConfirmDeleteFile}
      onOpenChange={onCloseConfirmDeleteFile}>
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

export const useConfirmDeleteFile = () => {
  const [datas, setDatas] = useQueryStates({
    openCdf: parseAsBoolean.withDefault(false),
    fileTarget: parseAsString.withDefault(""),
    cTarget: parseAsString.withDefault(""),
  });

  const onOpenConfirmDeleteFile = useCallback(
    (fileId: string, clientId: string) => {
      const { success } = z.string().trim().cuid().safeParse(fileId);
      if (!success) return;

      setDatas(() => {
        return {
          openCdf: true,
          fileTarget: fileId,
          cTarget: clientId,
        };
      });
    },
    []
  );

  const onCloseConfirmDeleteFile = useCallback(() => {
    setDatas(() => {
      return {
        openCdf: false,
        fileTarget: "",
        cTarget: "",
      };
    });
  }, []);

  const openConfirmDeleteFile = datas.openCdf;
  const fileId = datas.fileTarget;
  const clientId = datas.cTarget;

  return {
    openConfirmDeleteFile,
    fileId,
    clientId,
    onOpenConfirmDeleteFile,
    onCloseConfirmDeleteFile,
  };
};
