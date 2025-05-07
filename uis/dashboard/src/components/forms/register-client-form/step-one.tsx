import { FormWrapper } from "@/components/rhf/form-wrapper";
import { TextField } from "@/components/rhf/text-field";
import { useStepsControl } from "@/components/forms/register-client-form/hooks/use-steps-control";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectStore } from "./select-store";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "@/hooks/use-debounce";
import { cnpja } from "@/lib/cnpj";
import { StepOneSchema, stepOneSchema } from "./schemas/step-one.schema";
import { SelectField } from "@/components/rhf/select-field";
import { TYPES } from "@/constants";
import { useMultiStepsForm } from "./hooks/use-multi-steps-form";
import { RefreshCcw } from "lucide-react";

export const RegisterFormFistStep = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { navigate, focus } = useStepsControl();
  const { currentFormData, setFormData, clear } = useMultiStepsForm();

  const methods = useForm({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      name: currentFormData.name || "",
      email: currentFormData.email || "",
      phone:
        (currentFormData.areaCode &&
          currentFormData.phone &&
          currentFormData.areaCode + currentFormData.phone) ||
        "",
      areaCode: currentFormData.areaCode || "",
      homepage: currentFormData.homepage || "",
      storeCode: currentFormData.storeCode || "",
      taxId: currentFormData.taxId || null,
      openingDate: currentFormData.openingDate || null,
      tradeName: currentFormData.tradeName || null,
      type: currentFormData.type || null,
    },
  });

  const taxIdWatch = methods.watch("taxId");
  methods.setFocus(focus as keyof typeof methods.getValues);
  useEffect(() => {
    methods.setFocus(focus as keyof typeof methods.getValues);
    if (taxIdWatch) {
      const isCNPJ = taxIdWatch.length === 14;

      if (!isCNPJ && taxIdWatch.length === 11) {
        methods.setValue("tradeName", null);
      }
    } else {
      methods.setValue("openingDate", null);
      methods.setValue("tradeName", null);
    }
  }, [taxIdWatch, methods.setValue]);

  const handleCpfCnpj = useDebounceCallback(async (value: string) => {
    if (value.length === 14) {
      try {
        setIsLoading(true);
        methods.clearErrors("taxId");

        const data = await cnpja.office.read({
          taxId: value,
        });

        methods.setValue("tradeName", data.alias || data.company.name);
        methods.setValue(
          "openingDate",
          data.founded.split("-").reverse().join("")
        );
        methods.setValue("type", "J");
      } catch (e) {
        console.log(e);
        methods.setError("taxId", { message: "CNPJ invalido" });
      } finally {
        setIsLoading(false);
      }
    }
    if (value.length === 11) {
      methods.setValue("tradeName", null);
      methods.setValue("openingDate", null);
      methods.setValue("type", "F");
    }
  }, 500);

  const onSubmit = (data: StepOneSchema) => {
    setFormData(data);
    navigate(2);
  };

  return (
    <FormWrapper method={methods}>
      <form
        id="register_client_step_1"
        className="space-y-6"
        onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div>
            <div className="inline-flex items-center gap-5">
              <h2 className="text-zinc-800 text-2xl font-bold">
                Dados Pessoas
              </h2>
              <button
                type="button"
                onClick={clear}
                className="text-zinc-800 cursor-pointer">
                <RefreshCcw size={20} />
                <span className="sr-only">Limpar o formulário</span>
              </button>
            </div>

            <p className="text-zinc-400">
              Insira algumas informações sobre o cliente
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-1 row-span-4 space-y-5">
              <TextField<StepOneSchema> name="name" required label="Nome" />
              <TextField<StepOneSchema> name="email" label="Email" />
              <TextField<StepOneSchema>
                name="phone"
                mask="phone"
                label="Numero de contato"
              />
              <TextField<StepOneSchema> name="homepage" label="Home page" />

              <SelectStore<StepOneSchema> name="storeCode" />
            </div>
            <div className="grid gap-5">
              <div className="row-span-1 col-span-2">
                <TextField<StepOneSchema>
                  name="taxId"
                  label="CPF/CNPJ"
                  mask="cpf/cnpj"
                  changeInterceptor={handleCpfCnpj}
                />
              </div>
              <div className="row-span-1 col-span-2 gap-4 flex">
                {taxIdWatch && taxIdWatch.length === 11 && (
                  <TextField<StepOneSchema>
                    name="openingDate"
                    label="Data de nascimento"
                    mask="date"
                  />
                )}
                {taxIdWatch && taxIdWatch.length === 14 && (
                  <TextField<StepOneSchema>
                    name="openingDate"
                    label="Data de abertura"
                    mask="date"
                    isLoading={isLoading}
                  />
                )}
                {taxIdWatch && [11, 14].includes(taxIdWatch.length) && (
                  <SelectField<StepOneSchema>
                    name="type"
                    label="Tipo de cadastro"
                    options={TYPES}
                    readonly
                    required
                  />
                )}
              </div>
              {taxIdWatch && taxIdWatch.length === 14 && (
                <div className="row-span-1 col-span-2 space-x-6 flex">
                  <TextField<StepOneSchema>
                    name="tradeName"
                    label="Nome fantasia"
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
            Salvar e continuar
          </Button>
        </div>
      </form>
    </FormWrapper>
  );
};
