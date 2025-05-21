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
  useConfirmDeleteFiles,
} from "../modals/confirm-delete-file";

interface TableSheetProps {
  client: Client;
}

export const TableSheet = ({ client }: TableSheetProps) => {
  const { open } = useConfirmDeleteFiles();
  const { open: openForm, onOpen } = useUploadClientFileModal();

  const { data, isLoading } = useQuery({
    queryFn: () => ApiListClientFiles({ clientId: client.id }),
    queryKey: ["client-files", client.id],
  });

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size={"sm"}
            className="cursor-pointer w-full border-none font-normal focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            Arquivos
          </Button>
        </SheetTrigger>
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
                    onClick={() => onOpen(client.id)}
                    className="rounded-full cursor-pointer p-1 hover:bg-blue-50/50">
                    <FilePlus size={16} />
                    <span className="sr-only">salvar novo arquivo</span>
                  </button>
                </div>
              </div>
              <div className="px-2">
                {isLoading ? (
                  <p>carregando...</p>
                ) : data && data.clientFiles.length > 0 ? (
                  data.clientFiles.map((file, i) => (
                    <FileTree item={file} clientId={client.id} key={i} />
                  ))
                ) : (
                  "Nenhum Arquivo"
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
      {openForm && <UploadClientFileModal />}
      {open && <ConfirmDeleteFile />}
    </>
  );
};
