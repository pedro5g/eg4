import { FormWrapper } from "@/components/rhf/form-wrapper";
import { PasswordField } from "@/components/rhf/password-field";
import { TextField } from "@/components/rhf/text-field";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { ApiSignUp } from "@/api/endpoints";
import { Loader2 } from "lucide-react";
import { ApiError } from "@/api/types";

export const signUpFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: "O nome precisa ter no mínimo três letras" })
      .max(50, { message: "O nome está muito longo" }),
    email: z.string().trim().email({ message: "Digite um email valido" }),
    password: z
      .string()
      .trim()
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
      .max(150, { message: "A senha deve ter no máximo 150 caracteres" }),
    confirmPassword: z
      .string()
      .trim()
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
      .max(150, { message: "A senha deve ter no máximo 150 caracteres" }),
  })
  .refine((args) => args.password === args.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não são iguais",
  });

type SignUpFormSchemaType = z.infer<typeof signUpFormSchema>;

export function SignUp() {
  const navigate = useNavigate();

  const methods = useForm<SignUpFormSchemaType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SignUpFormSchemaType) => ApiSignUp(data),
    onSuccess: ({ ok }) => {
      if (ok) {
        window.toast.success("Registrado com sucesso 👌");
        navigate("/sign-in");
        methods.reset();
      }
    },
    onError: (error: ApiError) => {
      if (error.errorCode === "AUTH_EMAIL_ALREADY_EXISTS") {
        window.toast.error("Parece que você já tem uma conta.", {
          description: "Por favor faça login",
        });
        methods.setError("email", {
          message: "Parece que você já tem uma conta.",
        });
        return;
      }
      window.toast.error("Erro inesperado, por favor tente mais tarde");
    },
  });

  const onSubmit = (data: SignUpFormSchemaType) => {
    if (isPending) return;
    mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-5 px-2 md:px-4">
      <main className="w-full flex flex-col items-center justify-center ">
        <div className="max-w-[320px] w-full space-y-8">
          <div>
            <h3 className="font-bold text-[2.5rem] text-zinc-800">Registrar</h3>
            <span className="text-base text-zinc-500">
              Cadastre-se para aproveitar nossos recursos
            </span>
          </div>
          <FormWrapper method={methods}>
            <form className="w-full" onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="w-full space-y-5">
                <TextField<SignUpFormSchemaType>
                  name="name"
                  label="Nome"
                  type="text"
                />
                <TextField<SignUpFormSchemaType>
                  name="email"
                  label="Email"
                  type="email"
                />
                <PasswordField<SignUpFormSchemaType>
                  show
                  name="password"
                  label="Senha"
                />
                <PasswordField<SignUpFormSchemaType>
                  name="confirmPassword"
                  label="Repita sua senha"
                />
                <Button
                  type="submit"
                  className="bg-blue-600 w-full py-6 cursor-pointer hover:bg-blue-500">
                  Cadastrar
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                </Button>
              </div>
            </form>
          </FormWrapper>
        </div>
      </main>

      <span className="text-base text-zinc-500 font-light">
        Já tem uma conta??{" "}
        <Link
          className="text-blue-500 font-semibold hover:underline"
          to={"/sign-in"}>
          Entrar
        </Link>
      </span>
    </div>
  );
}
