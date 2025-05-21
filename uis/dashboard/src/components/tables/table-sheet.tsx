import { ApiListClientFiles } from "@/api/endpoints";
import { Client } from "@/api/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { FilePlus } from "lucide-react";
import {
  UploadClientFileModal,
  useUploadClientFileModal,
} from "../modals/upload-client-file-modal";
import { FileTree } from "./file-tree";
import {
  ConfirmDeleteFile,
  useConfirmDeleteFile,
} from "../modals/confirm-delete-file";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import React, { useCallback, useMemo } from "react";

interface TableSheetProps {
  client: Client;
  children: React.ReactNode;
}

export const TableSheet = ({ client, children }: TableSheetProps) => {
  const { openConfirmDeleteFile } = useConfirmDeleteFile();
  const { openUploadClientFileModal, onOpenUploadClientFileModal } =
    useUploadClientFileModal();

  const { data, isLoading } = useQuery({
    queryFn: () => ApiListClientFiles({ clientId: client.id }),
    queryKey: ["client-files", client.id],
  });

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent side="right" className="flex flex-col">
          <SheetHeader className="gap-1">
            <SheetTitle>Arquivos do {client.name}</SheetTitle>
            <SheetDescription>Arquivos do cliente</SheetDescription>
          </SheetHeader>
          <div className="px-4 flex-1 flex">
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto text-sm bg-zinc-50 rounded-sm">
              <div className="inline-flex items-center justify-end w-full bg-blue-50 py-1 px-4">
                <div className="inline-flex items-center gap-2 text-zinc-600">
                  <button
                    onClick={() => onOpenUploadClientFileModal(client.id)}
                    className="rounded-full cursor-pointer p-1 hover:bg-blue-50/50">
                    <FilePlus size={16} />
                    <span className="sr-only">salvar novo arquivo</span>
                  </button>
                </div>
              </div>
              <div className="w-full space-y-2 max-h-[600px] scroll-py-1 overflow-x-hidden overflow-y-auto px-2 text-center">
                {isLoading ? (
                  <p>carregando...</p>
                ) : data && data.clientFiles.length > 0 ? (
                  data.clientFiles.map((file, i) => (
                    <FileTree item={file} clientId={client.id} key={i} />
                  ))
                ) : (
                  <p>Nenhum Arquivo</p>
                )}
              </div>
            </div>
          </div>
          <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Fechar
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {openUploadClientFileModal && <UploadClientFileModal />}
      {openConfirmDeleteFile && <ConfirmDeleteFile />}
    </>
  );
};

export const useFileSheet = () => {
  const [datas, setDatas] = useQueryStates({
    openFShee: parseAsBoolean.withDefault(false),
    clt: parseAsString.withDefault(""),
  });

  const onOpenFileSheet = useCallback((client: Client) => {
    setDatas(() => {
      return {
        openFShee: true,
        clt: encodeURIComponent(JSON.stringify(client)),
      };
    });
  }, []);

  const onCloseFolderSheet = useCallback(() => {
    setDatas(() => {
      return {
        openFShee: false,
        clt: "",
      };
    });
  }, []);

  const openFolderSheet = datas.openFShee;
  const client = useMemo(() => {
    try {
      return JSON.parse(decodeURIComponent(datas.clt)) as Client;
    } catch (e) {
      onCloseFolderSheet();
      return null;
    }
  }, [datas.clt]);

  return {
    openFolderSheet,
    client,
    onOpenFileSheet,
    onCloseFolderSheet,
  };
};
