import { FormWrapper } from "@/components/rhf/form-wrapper";
import { PasswordField } from "@/components/rhf/password-field";
import { TextField } from "@/components/rhf/text-field";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { ApiSignIn } from "@/api/endpoints";
import { Loader2 } from "lucide-react";
import { ApiError } from "@/api/types";
import { isJavaVersion } from "@/lib/utils";

export const signInFormSchema = z.object({
  email: z.string().trim().email({ message: "Digite um email valido" }),
  password: z
    .string({ message: "Digite uma senha" })
    .trim()
    .min(1, { message: "Digite uma senha" }),
});

type SignInFormSchemaType = z.infer<typeof signInFormSchema>;

export function SignIn() {
  const navigate = useNavigate();

  const methods = useForm<SignInFormSchemaType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SignInFormSchemaType) => ApiSignIn(data),
    onSuccess: ({ ok }) => {
      if (ok) {
        isJavaVersion()
          ? navigate("/clients", { replace: true })
          : navigate("/dashboard", { replace: true });
        methods.reset();
      }
    },
    onError: (error: ApiError) => {
      if (["VALIDATION_ERROR", "BAD_REQUEST"].includes(error.errorCode)) {
        methods.setError("email", {
          message: "Email ou senha incorretos",
        });
        methods.setError("password", {
          message: "Email ou senha incorretos",
        });
        return;
      }
      window.toast.error("Erro inesperado, por favor tente mais tarde");
    },
  });

  const onSubmit = (data: SignInFormSchemaType) => {
    if (isPending) return;
    mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-5 px-2 md:px-4">
      <main className="w-full flex flex-col items-center justify-center ">
        <div className="max-w-[320px] w-full space-y-8">
          <div>
            <h3 className="font-bold text-[2.5rem] text-zinc-800">Entrar</h3>
            <span className="text-base text-zinc-500">
              Efetue login para entrar na sua conta.
            </span>
          </div>{" "}
          <FormWrapper method={methods}>
            <form className="w-full" onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="w-full space-y-5">
                <TextField<SignInFormSchemaType>
                  name="email"
                  label="Email"
                  type="email"
                />
                <PasswordField<SignInFormSchemaType>
                  show
                  name="password"
                  label="Senha"
                />
                <Button
                  disabled={isPending}
                  type="submit"
                  className="bg-blue-600 w-full py-6 cursor-pointer hover:bg-blue-500">
                  Entrar
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                </Button>
              </div>
            </form>
          </FormWrapper>
        </div>
      </main>

      <span className="text-base text-zinc-500 font-light">
        Precisa de uma conta?{" "}
        <Link
          className="text-blue-500 font-semibold hover:underline"
          to={"/sign-up"}>
          Registrar
        </Link>
      </span>
    </div>
  );
}
