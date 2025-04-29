import { FormWrapper } from "@/components/rhf/form-wrapper";
import { TextField } from "@/components/rhf/text-field";
import { useForm } from "react-hook-form";
import {
  registerClientSecondStepSchema,
  RegisterClientSecondStepSchemaType,
} from "./schemas/register-client-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterClientForm } from "./form-context";
import { useRegisterClientStep } from "@/hooks/use-register-client-step";
import { useCallback, useState } from "react";
import { SelectField } from "@/components/rhf/select-field";
import { STATES } from "@/constants";

export const RegisterFormSecondStep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { next } = useRegisterClientStep();
  const { currentFormData, setFormData } = useRegisterClientForm();

  const methods = useForm<RegisterClientSecondStepSchemaType>({
    resolver: zodResolver(registerClientSecondStepSchema),
    defaultValues: {
      zipCode: currentFormData.zipCode || "",
      neighborhood: currentFormData.neighborhood || "",
      address: currentFormData.address || "",
      city: currentFormData.city || "",
      cityCode: currentFormData.cityCode || "",
      country: currentFormData.country || "",
      state: currentFormData.state || "",
    },
  });

  const handleCep = useCallback(async (cep: string) => {
    if (cep.length !== 8) return;
    try {
      setIsLoading(true);
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      // await new Promise((resolve) => setTimeout(resolve, 500));
      methods.setValue("address", data.logradouro);
      methods.setValue("city", data.localidade);
      methods.setValue("state", data.uf);
      methods.setValue("neighborhood", data.bairro);
      methods.setValue("cityCode", data.ibge);
      methods.clearErrors();
    } catch (e) {
      console.log(e);
      methods.setError("zipCode", { message: "CEP invalido" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onSubmit = (data: RegisterClientSecondStepSchemaType) => {
    setFormData(data);
    next();
  };

  return (
    <FormWrapper method={methods}>
      <form
        id="form_step_2"
        className="space-y-6"
        onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div>
            <h2 className="text-zinc-800 text-2xl font-bold">Endereço</h2>
            <p className="text-zinc-400">
              Insira algumas informações sobre cliente
            </p>
          </div>
          <div className="grid grid-cols-2 grid-rows-5 gap-4">
            <div className="row-span-1 col-span-2 w-fit">
              <TextField<RegisterClientSecondStepSchemaType>
                className="py-2"
                name="zipCode"
                label="CEP"
                mask="cep"
                changeInterceptor={handleCep}
              />
            </div>
            <div className="row-span-1 col-span-2 space-x-6 flex">
              <TextField<RegisterClientSecondStepSchemaType>
                name="address"
                label="Endereço"
                isLoading={isLoading}
                required
              />
              <TextField<RegisterClientSecondStepSchemaType>
                name="neighborhood"
                label="Bairro"
                isLoading={isLoading}
                required
              />
            </div>
            <div className="row-span-1 col-span-2 space-x-6 flex">
              <TextField<RegisterClientSecondStepSchemaType>
                name="city"
                label="Cidade"
                isLoading={isLoading}
                required
              />
              <TextField<RegisterClientSecondStepSchemaType>
                name="cityCode"
                label="Codigo do Município"
                isLoading={isLoading}
              />
            </div>
            <div className="row-span-1 col-span-2 space-x-6 flex">
              <SelectField<RegisterClientSecondStepSchemaType>
                name="state"
                label="Estado"
                options={STATES}
                required
              />

              <TextField<RegisterClientSecondStepSchemaType>
                name="country"
                label="Pais"
              />
            </div>
          </div>
        </div>
      </form>
    </FormWrapper>
  );
};
