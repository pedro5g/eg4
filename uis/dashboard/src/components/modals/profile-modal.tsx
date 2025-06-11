import { useProfileModal } from "@/hooks/use-profile-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ApiError, User } from "@/api/types";
import { capitalize, formatPhone } from "@/lib/utils";
import { Loader2, Mail, MapPin, Phone, User as UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { z } from "zod";
import { FormWrapper } from "../rhf/form-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "../rhf/text-field";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiUpdateProfile } from "@/api/endpoints";
import { ProfileAvatar } from "../profile-avatar";

interface ProfileModalProps {
  user: User;
}

export const mobilePhoneSchema = z
  .string()
  .trim()
  .min(12, "Digite um numero de celular valido")
  .max(12, "Digite um numero de celular valido")
  .regex(/[0-9]$/g);
export const landlinesSchema = z
  .string()
  .trim()
  .min(11, "Digite um numero de telefone valido")
  .max(11, "Digite um numero de telefone valido")
  .regex(/[0-9]$/g);

const editFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "O nome precisa ter no mínimo três letras" })
    .max(50, { message: "O nome está muito longo" }),
  phone: z.union([mobilePhoneSchema, landlinesSchema]).nullable(),
  address: z
    .string()
    .trim()
    .min(1, { message: "Digite um endereço valido" })
    .max(255, "Endereço muito longo")
    .nullable(),
});

type EditFromSchemaType = z.infer<typeof editFormSchema>;

export const ProfileModal = ({ user }: ProfileModalProps) => {
  const { open, setOpen } = useProfileModal();
  const [openEditForm, setOpenEditForm] = useState(false);
  const queryClient = useQueryClient();

  const methods = useForm<EditFromSchemaType>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: user.name,
      address: user.address || "",
      phone: user.phone || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: EditFromSchemaType) => ApiUpdateProfile(data),
    onSuccess: async ({ ok }) => {
      if (ok) {
        window.toast.success("Perfil atualizado com sucesso");
        await queryClient.refetchQueries({ queryKey: ["user-profile"] });
        setOpenEditForm(false);
      }
    },
    onError: (_error: ApiError) => {
      window.toast.error("Erro, por favor tente mais tarde");
    },
  });

  const onSubmit = (data: EditFromSchemaType) => {
    if (isPending) return;
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="bg-blue-50 dark:bg-slate-600 -mx-6 -mt-6 px-6 pt-6 pb-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <DialogTitle>Perfil</DialogTitle>
          </div>
          <DialogDescription>
            Visualizar e manipular as informações to perfil
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <ProfileAvatar user={user} />
          <h3 className="text-xl font-semibold">{capitalize(user.name)}</h3>
          <p className="text-muted-foreground capitalize">
            {user.role === "SELLER" ? "Vendedor" : "Administrador"}
          </p>
        </div>

        <Separator className="bg-blue-100" />
        <div className="transition-all duration-300 ease-in-out">
          {!openEditForm ? (
            <div className="animate-out py-4 space-y-3 text-zinc-500">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-600 " />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span>{formatPhone(user.phone)}</span>
                </div>
              )}
              {user.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>{user.address}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in transition-all duration-200 ease-in">
              <FormWrapper method={methods}>
                <form
                  id="edit-profile-form"
                  onSubmit={methods.handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    <TextField<EditFromSchemaType>
                      name="name"
                      label="Nome"
                      required
                    />
                    <TextField<EditFromSchemaType>
                      name="phone"
                      label="Telefone"
                      mask="phone"
                    />
                    <TextField<EditFromSchemaType>
                      name="address"
                      label="Endereço"
                    />
                  </div>
                </form>
              </FormWrapper>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-2">
          {openEditForm ? (
            <>
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => setOpenEditForm(false)}>
                Fechar
              </Button>
              <Button
                form="edit-profile-form"
                type="submit"
                disabled={
                  Object.keys(methods.formState.dirtyFields).length === 0 ||
                  isPending
                }
                className="bg-blue-600 hover:bg-blue-700 dark:text-white cursor-pointer ml-auto">
                <UserIcon className="mr-2 h-4 w-4" />
                {isPending ? "Editando" : "Editar"}
                {isPending && <Loader2 size={16} className="animate-spin" />}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setOpenEditForm(!openEditForm)}
              className="bg-blue-600 hover:bg-blue-700 dark:text-white cursor-pointer ml-auto">
              <UserIcon className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
