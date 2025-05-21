import { useForm } from "react-hook-form";
import { FormWrapper } from "../rhf/form-wrapper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField } from "../rhf/text-field";
import { Dropzone } from "../rhf/dropzone";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiCreateClientFile } from "@/api/endpoints";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { useCallback } from "react";

const uploadFormSchema = z
  .object({
    clientId: z.string().trim().cuid(),
    bucket: z.string().trim().min(2).max(100),
    file: z.instanceof(File),
  })
  .transform(({ bucket, ...rest }) => {
    return { ...rest, bucket: bucket.replace(/^\/|\/$/g, "") };
  });

type UploadFromSchemaType = z.infer<typeof uploadFormSchema>;

export const UploadClientFileModal = () => {
  const { open, onClose, clientId, folderPath } = useUploadClientFileModal();
  const queryClient = useQueryClient();

  const methods = useForm({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      clientId,
      bucket: folderPath || "/documentos",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => ApiCreateClientFile(data),
    onSuccess: async ({ ok }) => {
      if (ok) {
        await queryClient.refetchQueries({
          queryKey: ["client-files", clientId],
        });
        window.toast.success("Arquivo salvo com sucesso", { duration: 1000 });
        onClose();
      }
    },
    onError: (error) => {
      console.log(error);
      window.toast.error("Erro ao salvar o arquivo", { duration: 1000 });
    },
  });

  const onSubmit = ({ clientId, bucket, file }: UploadFromSchemaType) => {
    if (isPending) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);
    formData.append("clientId", clientId);

    mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upar arquivos do cliente</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <FormWrapper method={methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit(onSubmit, (error) =>
              console.log("error", error)
            )}>
            <Dropzone<UploadFromSchemaType> name="file" />
            <div>
              <TextField<UploadFromSchemaType>
                name="bucket"
                label="Pasta"
                required
              />
              <span className="text-xs text-zinc-600">
                Passa o nome da pasta que deseja salvar o arquivo,{" "}
                <b>(Ex): /pdfs ou /arquivos/pdfs</b>
              </span>
            </div>
            <div className="inline-flex w-full items-center justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer ml-auto">
                Salvar
              </Button>
            </div>
          </form>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export const useUploadClientFileModal = () => {
  const [datas, setDatas] = useQueryStates({
    openUm: parseAsBoolean.withDefault(false),
    folderP: parseAsString.withDefault(""),
    cTarget: parseAsString.withDefault(""),
  });

  const onOpen = useCallback((clientId: string, folderP: string = "") => {
    setDatas(() => {
      return {
        openUm: true,
        folderP: encodeURIComponent(folderP),
        cTarget: clientId,
      };
    });
  }, []);

  const onClose = useCallback(() => {
    setDatas(() => {
      return {
        openUm: false,
        folderP: "",
        cTarget: "",
      };
    });
  }, []);

  const open = datas.openUm;
  const folderPath = decodeURIComponent(datas.folderP);
  const clientId = datas.cTarget;

  return {
    open,
    folderPath,
    clientId,
    onOpen,
    onClose,
  };
};
