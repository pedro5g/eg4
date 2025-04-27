import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Camera, Check, Loader2 } from "lucide-react";
import { ApiError, User } from "@/api/types";
import { ChangeEvent, useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiUpdateAvatarProfile } from "@/api/endpoints";

interface ProfileAvatarProps {
  user: User;
}

export const ProfileAvatar = ({ user }: ProfileAvatarProps) => {
  const [newImage, setNewImage] = useState<File | null>(null);
  const newImageSrc = newImage ? URL.createObjectURL(newImage) : null;
  const queryClient = useQueryClient();

  const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.length) {
      setNewImage(e.target.files[0]);
    }
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => ApiUpdateAvatarProfile(data),
    onSuccess: async ({ ok }) => {
      if (ok) {
        window.toast.success("Imagem do perfil atualizado com sucesso");
        await queryClient.refetchQueries({ queryKey: ["user-profile"] });
        setNewImage(null);
      }
    },
    onError: (_error: ApiError) => {
      window.toast.error("Erro, por favor tente mais tarde");
    },
  });

  const changeImage = useCallback(() => {
    if (isPending || !newImage) return;

    const formdata = new FormData();
    formdata.append("file", newImage);
    mutate(formdata);
  }, [newImage]);

  return (
    <div className="relative">
      <Avatar className="h-24 w-24 mb-4 ring-4 ring-blue-100 bg-blue-50">
        <AvatarImage
          src={newImageSrc || user.avatarUrl || ""}
          alt={user.name}
        />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full size-24">
          <Loader2 className="animate-spin text-zinc-500 " />
        </div>
      )}
      <label
        htmlFor="avatar-profile"
        className="absolute bottom-2 size-5 rounded-full ring-3 flex cursor-pointer 
            items-center justify-center right-1 ring-blue-200 bg-blue-200/40 z-10">
        <Camera size={16} />
        <input
          onChange={onFileChange}
          type="file"
          id="avatar-profile"
          className="sr-only"
          accept="image/*"
        />
        <span className="sr-only">Escolher nova imagem de perfil</span>
      </label>
      {newImage && (
        <button
          onClick={changeImage}
          disabled={isPending}
          title="Salvar nova imagem"
          className="absolute bottom-6.5 size-5 rounded-full ring-3 flex cursor-pointer 
            items-center justify-center -right-3.5 ring-green-200 bg-green-200/40 z-10">
          <Check size={16} />
          <span className="sr-only">Trocam imagem de perfil</span>
        </button>
      )}
    </div>
  );
};
