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
import { useState } from "react";
import { SelectField } from "@/components/rhf/select-field";
import { STATES } from "@/constants";
import { Button } from "@/components/ui/button";
import { useDebounceCallback } from "@/hooks/use-debounce";

export const RegisterFormSecondStep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { next, prev, direction, setDirection } = useRegisterClientStep();
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

  const handleCep = useDebounceCallback(async (cep: string) => {
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
  }, 500);

  const onSubmit = (data: RegisterClientSecondStepSchemaType) => {
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
        id="register_client_step_2"
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
            <div className="col-span-2 w-fit">
              <TextField<RegisterClientSecondStepSchemaType>
                className="py-2"
                name="zipCode"
                label="CEP"
                mask="cep"
                changeInterceptor={handleCep}
              />
            </div>
            <div className=" col-span-2 space-x-6 flex">
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
            <div className=" col-span-2 space-x-6 flex">
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
            <div className=" col-span-2 space-x-6 flex">
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
