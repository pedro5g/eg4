import { FormWrapper } from "@/components/rhf/form-wrapper";
import { TextField } from "@/components/rhf/text-field";
import { useForm } from "react-hook-form";
import {
  registerClientThirdStepSchema,
  RegisterClientThirdStepSchemaType,
} from "./schemas/register-client-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterClientForm } from "./form-context";
import { useDebounceCallback } from "@/hooks/use-debounce";
import { cnpja } from "@/lib/cnpj";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRegisterClientStep } from "@/hooks/use-register-client-step";

export const RegisterFormThirdStep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { next, prev, direction, setDirection } = useRegisterClientStep();
  const { currentFormData, setFormData } = useRegisterClientForm();

  const methods = useForm<RegisterClientThirdStepSchemaType>({
    resolver: zodResolver(registerClientThirdStepSchema),
    defaultValues: {
      taxId: currentFormData.taxId || "",
      openingDate: currentFormData.openingDate || "",
      tradeName: currentFormData.tradeName || "",
      type: currentFormData.type || "",
    },
  });

  const taxIdWatch = methods.watch("taxId");

  const handleCpfCnpj = useDebounceCallback(async (value: string) => {
    if (value.length === 14) {
      try {
        setIsLoading(true);

        const data = await cnpja.office.read({
          taxId: value,
        });
        methods.setValue("tradeName", data.alias || data.company.name);
        methods.setValue(
          "openingDate",
          data.founded.split("-").reverse().join("")
        );
        methods.setValue("type", "Pessoa Jurídica");
      } catch (e) {
        console.log(e);

        methods.setError("taxId", { message: "CNPJ invalido" });
      } finally {
        setIsLoading(false);
      }
    }
    if (value.length === 11) {
      methods.setValue("type", "");
      methods.setValue("tradeName", "");
      methods.setValue("openingDate", "");

      methods.setValue("type", "Pessoa Física");
    }
    methods.clearErrors("taxId");
  }, 500);

  const onSubmit = (data: RegisterClientThirdStepSchemaType) => {
    setFormData(data);
    if (direction === "next") {
      next();
    } else {
      prev();
    }
  };

  return (
    <FormWrapper method={methods}>
      <form
        id="register_client_step_3"
        className="space-y-6"
        onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="grid gap-4 ">
          <div>
            <h2 className="text-zinc-800 text-2xl font-bold">Documentos</h2>
            <p className="text-zinc-400">
              Insira algumas informações sobre cliente
            </p>
          </div>
          <div className="grid grid-cols-2">
            <div className="grid grid-rows-5 gap-5">
              <div className="row-span-1 col-span-2">
                <TextField<RegisterClientThirdStepSchemaType>
                  name="taxId"
                  label="CPF/CNPJ"
                  mask="cpf/cnpj"
                  changeInterceptor={handleCpfCnpj}
                />
              </div>
              <div className="row-span-1 col-span-2 gap-4 flex">
                {taxIdWatch && taxIdWatch.length === 11 && (
                  <TextField<RegisterClientThirdStepSchemaType>
                    name="openingDate"
                    label="Data de nascimento"
                    mask="date"
                    required
                  />
                )}
                {taxIdWatch && taxIdWatch.length === 14 && (
                  <TextField<RegisterClientThirdStepSchemaType>
                    name="openingDate"
                    label="Data de abertura"
                    mask="date"
                    isLoading={isLoading}
                  />
                )}
                {taxIdWatch && [11, 14].includes(taxIdWatch.length) && (
                  <TextField<RegisterClientThirdStepSchemaType>
                    name="type"
                    label="Tipo do cadastro"
                    isLoading={isLoading}
                  />
                )}
              </div>
              {taxIdWatch && taxIdWatch.length === 14 && (
                <div className="row-span-1 col-span-2 space-x-6 flex">
                  <TextField<RegisterClientThirdStepSchemaType>
                    name="tradeName"
                    label="Nome fantasia"
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-5 justify-end">
            <Button
              type="submit"
              onClick={() => {
                setDirection("prev");
              }}
              className="bg-blue-600/90 hover:bg-blue-700/70 cursor-pointer">
              Voltar
            </Button>
            <Button
              type="submit"
              onClick={() => {
                setDirection("next");
              }}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              Avançar
            </Button>
          </div>
        </div>
      </form>
    </FormWrapper>
  );
};
