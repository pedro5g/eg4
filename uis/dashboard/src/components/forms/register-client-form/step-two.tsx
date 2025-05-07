import { FormWrapper } from "@/components/rhf/form-wrapper";
import { TextField } from "@/components/rhf/text-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStepsControl } from "@/components/forms/register-client-form/hooks/use-steps-control";
import { useState } from "react";
import { SelectField } from "@/components/rhf/select-field";
import { STATES } from "@/constants";
import { Button } from "@/components/ui/button";
import { useDebounceCallback } from "@/hooks/use-debounce";
import { StepTwoSchema, stepTwoSchema } from "./schemas/step-two.schema";
import { useMultiStepsForm } from "./hooks/use-multi-steps-form";
import { RefreshCcw } from "lucide-react";

export const RegisterFormSecondStep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { navigate, focus } = useStepsControl();
  const { currentFormData, setFormData, clear } = useMultiStepsForm();

  const methods = useForm({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      zipCode: currentFormData.zipCode || "",
      neighborhood: currentFormData.neighborhood || "",
      address:
        (currentFormData.address && currentFormData.address.split("n°")[0]) ||
        "",
      city: currentFormData.city || "",
      cityCode: currentFormData.cityCode || null,
      country: currentFormData.country || "",
      state: currentFormData.state || "",
      houseNumber:
        (currentFormData.address && currentFormData.address.split("n°")[1]) ||
        "",
    },
  });

  methods.setFocus(focus as keyof typeof methods.getValues);

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
      methods.setValue("houseNumber", "");
      methods.clearErrors();
    } catch (e) {
      console.log(e);
      methods.setError("zipCode", { message: "CEP invalido" });
    } finally {
      setIsLoading(false);
    }
  }, 500);

  const onSubmit = (data: StepTwoSchema) => {
    setFormData(data);
    navigate(3);
  };

  return (
    <FormWrapper method={methods}>
      <form
        id="register_client_step_2"
        className="space-y-6"
        onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div>
            <div className="inline-flex items-center gap-5">
              <h2 className="text-zinc-800 text-2xl font-bold">Endereço</h2>
              <button
                type="button"
                onClick={clear}
                className="text-zinc-800 cursor-pointer">
                <RefreshCcw size={20} />
                <span className="sr-only">Limpar o formulário</span>
              </button>
            </div>
            <p className="text-zinc-400">
              Insira algumas informações sobre cliente
            </p>
          </div>
          <div className="grid grid-cols-2 grid-rows-5 gap-4">
            <div className="col-span-2 w-fit">
              <TextField<StepTwoSchema>
                className="py-2"
                name="zipCode"
                label="CEP"
                mask="cep"
                changeInterceptor={handleCep}
              />
            </div>
            <div className=" col-span-2 space-x-6 flex">
              <TextField<StepTwoSchema>
                name="address"
                label="Endereço"
                isLoading={isLoading}
                required
              />
              <TextField<StepTwoSchema>
                name="neighborhood"
                label="Bairro"
                isLoading={isLoading}
                required
              />
              <TextField<StepTwoSchema>
                name="houseNumber"
                label="Numero da casa"
                isLoading={isLoading}
                required
              />
            </div>
            <div className=" col-span-2 space-x-6 flex">
              <TextField<StepTwoSchema>
                name="city"
                label="Cidade"
                isLoading={isLoading}
                required
              />
              <TextField<StepTwoSchema>
                name="cityCode"
                label="Codigo do Município"
                isLoading={isLoading}
              />
            </div>
            <div className=" col-span-2 space-x-6 flex">
              <SelectField<StepTwoSchema>
                name="state"
                label="Estado"
                options={STATES}
                required
              />

              <TextField<StepTwoSchema> name="country" label="Pais" />
            </div>
          </div>
          <div className="flex gap-5 justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              Salvar e continuar
            </Button>
          </div>
        </div>
      </form>
    </FormWrapper>
  );
};
