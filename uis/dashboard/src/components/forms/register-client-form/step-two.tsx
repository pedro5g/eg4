import { FormWrapper } from "@/components/rhf/form-wrapper";
import { TextField } from "@/components/rhf/text-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStepsControl } from "@/components/forms/register-client-form/hooks/use-steps-control";
import { SelectField } from "@/components/rhf/select-field";
import { COUNTRIES, STATES } from "@/constants";
import { Button } from "@/components/ui/button";
import { StepTwoSchema, stepTwoSchema } from "./schemas/step-two.schema";
import { useMultiStepsForm } from "./hooks/use-multi-steps-form";
import { RefreshCcw } from "lucide-react";
import { useCep } from "@/hooks/use-cep";
import { AnimationDiv } from "./animation-div";

export const RegisterFormSecondStep = ({
  direction,
}: {
  direction: number;
}) => {
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
      country: currentFormData.country || null,
      state: currentFormData.state || "",
      houseNumber:
        (currentFormData.address && currentFormData.address.split("n°")[1]) ||
        "",
    },
  });

  if (focus) {
    methods.setFocus(focus as keyof typeof methods.getValues);
  }

  const { handleCep, isFetchingCep } = useCep({
    setAddress: (value) => methods.setValue("address", value),
    setCity: (value) => methods.setValue("city", value),
    setState: (value) => methods.setValue("state", value),
    setNeighborhood: (value) => methods.setValue("neighborhood", value),
    setCityCode: (value) => methods.setValue("cityCode", value),
    setHouseNumber: (value) => methods.setValue("houseNumber", value),
    setZipError: (error) => methods.setError("zipCode", { message: error }),
    setCountry: (value) => methods.setValue("country", value),
    clearError: () => methods.clearErrors("zipCode"),
  });

  const onSubmit = (data: StepTwoSchema) => {
    setFormData(data);
    navigate(3);
  };

  return (
    <AnimationDiv direction={direction}>
      <FormWrapper method={methods}>
        <form
          id="register_client_step_2"
          className="space-y-6"
          onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div>
              <div className="inline-flex items-center gap-5">
                <h2 className="text-zinc-800 dark:text-zinc-100 text-2xl font-bold">
                  Endereço
                </h2>
                <button
                  type="button"
                  onClick={clear}
                  className="text-zinc-800 dark:text-zinc-100 cursor-pointer">
                  <RefreshCcw size={20} />
                  <span className="sr-only">Limpar o formulário</span>
                </button>
              </div>
              <p className="text-zinc-400">
                Insira algumas informações sobre cliente
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2 w-fit">
                <TextField<StepTwoSchema>
                  className="py-2"
                  name="zipCode"
                  label="CEP"
                  mask="cep"
                  changeInterceptor={handleCep}
                />
              </div>
              <div className="col-span-2 md:space-x-4 max-md:space-y-4 flex md:flex-row flex-col">
                <TextField<StepTwoSchema>
                  name="address"
                  label="Endereço"
                  isLoading={isFetchingCep}
                  required
                />
                <TextField<StepTwoSchema>
                  name="neighborhood"
                  label="Bairro"
                  isLoading={isFetchingCep}
                  required
                />
                <TextField<StepTwoSchema>
                  name="houseNumber"
                  label="Numero da casa"
                  isLoading={isFetchingCep}
                  required
                />
              </div>
              <div className="row-span-1 max-md:col-span-2">
                <TextField<StepTwoSchema>
                  name="city"
                  label="Cidade"
                  isLoading={isFetchingCep}
                  required
                />
              </div>
              <div className="row-span-1 max-md:col-span-2">
                <TextField<StepTwoSchema>
                  name="cityCode"
                  label="Codigo do Município"
                  isLoading={isFetchingCep}
                />
              </div>
              <div className="row-span-1 max-md:col-span-2">
                <SelectField<StepTwoSchema>
                  name="state"
                  label="Estado"
                  options={STATES}
                  required
                />
              </div>
              <div className="row-span-1 max-md:col-span-2">
                <SelectField<StepTwoSchema>
                  name="country"
                  label="País"
                  options={COUNTRIES}
                />
              </div>
            </div>
            <div className="flex gap-5 justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 dark:text-white cursor-pointer">
                Salvar e continuar
              </Button>
            </div>
          </div>
        </form>
      </FormWrapper>
    </AnimationDiv>
  );
};
