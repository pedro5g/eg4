import { FormWrapper } from "@/components/rhf/form-wrapper";
import { useRegisterClientForm } from "./form-context";
import { useForm } from "react-hook-form";
import {
  registerClientSchema,
  RegisterClientSchemaType,
} from "./schemas/register-client-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/rhf/text-field";
import { SelectField } from "@/components/rhf/select-field";
import { STATES } from "@/constants";
import { Button } from "@/components/ui/button";
import { useRegisterClientStep } from "@/hooks/use-register-client-step";
import { useMutation } from "@tanstack/react-query";
import { ApiRegisterClient } from "@/api/endpoints";
import { Loader2 } from "lucide-react";

export const Overview = () => {
  const { prev, setStep } = useRegisterClientStep();

  const { currentFormData, clearFormData } = useRegisterClientForm();

  const methods = useForm<RegisterClientSchemaType>({
    resolver: zodResolver(registerClientSchema),
    defaultValues: {
      name: currentFormData.name || "",
      email: currentFormData.email || "",
      phone:
        (currentFormData.areaCode &&
          currentFormData.phone &&
          currentFormData.areaCode + currentFormData.phone) ||
        "",
      areaCode: currentFormData.areaCode || "",
      zipCode: currentFormData.zipCode || "",
      neighborhood: currentFormData.neighborhood || "",
      address: currentFormData.address || "",
      city: currentFormData.city || "",
      cityCode: currentFormData.cityCode || "",
      country: currentFormData.country || "",
      state: currentFormData.state || "",
      taxId: currentFormData.taxId || "",
      openingDate: currentFormData.openingDate || "",
      tradeName: currentFormData.tradeName || "",
      type: currentFormData.type || "",
      status: "ACTIVE",
      homepage: currentFormData.homepage || "",
      storeCode: currentFormData.storeCode || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterClientSchemaType) => ApiRegisterClient(data),
    onSuccess: ({ ok }) => {
      if (ok) {
        window.toast.success("Client cadastrado com sucesso");
        clearFormData();
        setStep(1);
      }
    },
    onError: (erro) => {
      console.log(erro);
      window.toast.error("Erro, por favor tente mais tarde");
    },
  });

  const onSubmit = (data: RegisterClientSchemaType) => {
    if (isPending) return;
    mutate(data);
  };

  return (
    <div className="grid w-full h-full space-y-10">
      <div>
        <h1 className="text-zinc-800 text-3xl leading-0 font-semibold">
          Overview
        </h1>
      </div>
      <FormWrapper method={methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full">
          <div className="grid space-y-4 w-full py-4">
            <div className=" flex space-x-5">
              <TextField<RegisterClientSchemaType>
                className="w-fit py-2"
                name="storeCode"
                readonly
                label="Codigo da loja"
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-zinc-500">Dados pessoais</h3>
              <div className=" flex space-x-5">
                <TextField<RegisterClientSchemaType>
                  name="name"
                  readonly
                  label="Nome"
                />
                {currentFormData.email && (
                  <TextField<RegisterClientSchemaType>
                    name="email"
                    readonly
                    label="Email"
                  />
                )}
                {currentFormData.phone && (
                  <TextField<RegisterClientSchemaType>
                    name="phone"
                    readonly
                    label="Numero para contato"
                    mask="phone"
                  />
                )}
              </div>
              {currentFormData.homepage && (
                <div className="flex space-x-5">
                  <TextField<RegisterClientSchemaType>
                    name="homepage"
                    readonly
                    label="Home page"
                  />
                </div>
              )}
            </div>
            <div className="space-y-3">
              <h3 className="text-zinc-500">Endereço</h3>
              <div className=" flex space-x-5">
                {currentFormData.zipCode && (
                  <TextField<RegisterClientSchemaType>
                    className="w-fit py-2"
                    name="zipCode"
                    readonly
                    label="CEP"
                  />
                )}
              </div>
              <div className="flex space-x-5">
                {currentFormData.address && (
                  <TextField<RegisterClientSchemaType>
                    name="address"
                    readonly
                    label="Endereço"
                  />
                )}
                {currentFormData.neighborhood && (
                  <TextField<RegisterClientSchemaType>
                    name="neighborhood"
                    readonly
                    label="Bairro"
                  />
                )}
                {currentFormData.city && (
                  <TextField<RegisterClientSchemaType>
                    name="city"
                    readonly
                    label="Cidade"
                  />
                )}
              </div>
              <div className="flex space-x-5">
                {currentFormData.state && (
                  <SelectField<RegisterClientSchemaType>
                    name="state"
                    label="Estado"
                    readonly
                    options={STATES}
                  />
                )}
                {currentFormData.cityCode && (
                  <TextField<RegisterClientSchemaType>
                    name="cityCode"
                    label="Codigo do Município"
                    readonly
                  />
                )}
                {currentFormData.country && (
                  <TextField<RegisterClientSchemaType>
                    name="country"
                    label="Pais"
                    readonly
                  />
                )}
              </div>
            </div>
            {currentFormData.taxId && (
              <div className="space-y-3">
                <h3 className="text-zinc-500">Documento</h3>
                <div className="flex space-x-5">
                  {currentFormData.taxId && (
                    <TextField<RegisterClientSchemaType>
                      name="taxId"
                      label="CPF/CNPJ"
                      mask="cpf/cnpj"
                      readonly
                    />
                  )}
                  {currentFormData.openingDate &&
                    currentFormData.taxId?.length === 11 && (
                      <TextField<RegisterClientSchemaType>
                        name="openingDate"
                        label="Data de Nascimento"
                        mask="date"
                        readonly
                      />
                    )}
                  {currentFormData.openingDate &&
                    currentFormData.taxId?.length === 14 && (
                      <TextField<RegisterClientSchemaType>
                        name="openingDate"
                        label="Data de Abertura"
                        mask="date"
                        readonly
                      />
                    )}
                  {currentFormData.type && (
                    <TextField<RegisterClientSchemaType>
                      name="type"
                      label="Tipo de cadastro"
                      readonly
                    />
                  )}
                </div>
                <div className="flex space-x-5">
                  {currentFormData.tradeName && (
                    <TextField<RegisterClientSchemaType>
                      name="tradeName"
                      label="Nome fantasia"
                      readonly
                    />
                  )}
                </div>
              </div>
            )}
            <div className="flex gap-5 justify-end">
              <Button
                disabled={isPending}
                type="button"
                onClick={() => {
                  prev();
                }}
                className="bg-blue-600/90 hover:bg-blue-700/70 cursor-pointer">
                Voltar
              </Button>
              <Button
                disabled={isPending}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                Cadastrar
                {isPending && <Loader2 size={16} className="animate-spin" />}
              </Button>
            </div>
          </div>
        </form>
      </FormWrapper>
    </div>
  );
};
