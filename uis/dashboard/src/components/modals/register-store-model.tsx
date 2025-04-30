import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormWrapper } from "../rhf/form-wrapper";
import { TextField } from "../rhf/text-field";
import { CirclePlus, Loader2, StoreIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiCreateStore } from "@/api/endpoints";

const registerStoreFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Digite um nome valido")
    .max(255, "O nome está muito longo"),
  address: z
    .string()
    .trim()
    .nullable()
    .transform((value) => {
      if (value === "") return null;
      return value;
    })
    .pipe(
      z
        .string()
        .min(3, "Digite um endereço valido")
        .max(255, "O endereço está muito longo")
        .nullable()
    ),
});

type RegisterStoreFormSchemaType = z.infer<typeof registerStoreFormSchema>;

export const RegisterStoreModel = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const methods = useForm<RegisterStoreFormSchemaType>({
    resolver: zodResolver(registerStoreFormSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterStoreFormSchemaType) => ApiCreateStore(data),
    onSuccess: async ({ ok }) => {
      if (ok) {
        await queryClient.refetchQueries({
          queryKey: ["store-list"],
        });
        window.toast.success("Loja cadastrada com sucesso ✅");
        methods.reset();
      }
    },
    onError: () => {
      window.toast.error("Erro, por favor tente mais tarde");
    },
  });

  const onSubmit = (data: RegisterStoreFormSchemaType) => {
    if (isPending) return;
    mutate({ name: data.name, address: data.address });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full text-xs gap-2 text-zinc-500 bg-zinc-100 cursor-pointer inline-flex py-2 items-center justify-center">
          <span>Cadastrar nova loja</span>
          <CirclePlus size={16} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="inline-flex items-center">
            Cadastro de Loja <StoreIcon className="ml-4" size={20} />
          </DialogTitle>
          <DialogDescription>Registre suas lojas aqui</DialogDescription>
        </DialogHeader>
        <Separator className="bg-zinc-300" />
        <div className="w-full">
          <FormWrapper method={methods}>
            <form
              id="register_store_form"
              className="space-y-2"
              onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <TextField<RegisterStoreFormSchemaType>
                  name="name"
                  required
                  label="Nome"
                />
                <TextField<RegisterStoreFormSchemaType>
                  name="address"
                  label="Endereço"
                />
              </div>
              <div className="w-full flex items-center justify-end">
                <Button
                  form="register_store_form"
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer ml-auto">
                  Cadastrar
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                </Button>
              </div>
            </form>
          </FormWrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};
