import { FormWrapper } from "@/components/rhf/form-wrapper";
import { useForm } from "react-hook-form";
import {
  overviewSchema,
  OverviewSchema,
} from "./schemas/register-client-form-schema";
import { TextField } from "@/components/rhf/text-field";
import { SelectField } from "@/components/rhf/select-field";
import { STATES, TYPES } from "@/constants";
import { Button } from "@/components/ui/button";
import { useStepsControl } from "@/components/forms/register-client-form/hooks/use-steps-control";
import { useMutation } from "@tanstack/react-query";
import { ApiRegisterClient } from "@/api/endpoints";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMultiStepsForm } from "./hooks/use-multi-steps-form";
import { GoToField } from "./go-to-field";

export const Overview = () => {
  const { navigate } = useStepsControl();

  const { currentFormData, clearFormData } = useMultiStepsForm();

  const methods = useForm({
    resolver: zodResolver(overviewSchema),
    mode: "all",
    defaultValues: {
      name: currentFormData.name,
      email: currentFormData.email,
      phone:
        currentFormData.areaCode &&
        currentFormData.phone &&
        currentFormData.areaCode + currentFormData.phone,
      areaCode: currentFormData.areaCode,
      zipCode: currentFormData.zipCode,
      neighborhood: currentFormData.neighborhood,
      address:
        currentFormData.address && currentFormData.address.split("n°")[0],
      city: currentFormData.city,
      cityCode: currentFormData.cityCode,
      country: currentFormData.country,
      state: currentFormData.state,
      taxId: currentFormData.taxId,
      openingDate: currentFormData.openingDate,
      tradeName: currentFormData.tradeName,
      type: currentFormData.type,
      status: "ACTIVE",
      homepage: currentFormData.homepage,
      storeCode: currentFormData.storeCode,
      houseNumber:
        currentFormData.address && currentFormData.address.split("n°")[1],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: OverviewSchema) => ApiRegisterClient(data),
    onSuccess: ({ ok }) => {
      if (ok) {
        window.toast.success("Client cadastrado com sucesso");
        clearFormData();
        navigate(1);
      }
    },
    onError: (erro) => {
      console.log(erro);
      window.toast.error("Erro, por favor tente mais tarde");
    },
  });

  const onSubmit = (data: OverviewSchema) => {
    console.log(data);

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
        <form
          onSubmit={methods.handleSubmit(onSubmit, (data) => {
            console.log(data);
          })}
          className="w-full">
          <div className="grid space-y-4 w-full py-4">
            <div className=" flex space-x-5">
              <GoToField step={1} fieldName="storeCode">
                <TextField<OverviewSchema>
                  className="w-fit py-2"
                  name="storeCode"
                  readonly
                  label="Codigo da loja"
                />
              </GoToField>
            </div>
            <div className="space-y-3">
              <h3 className="text-zinc-500">Dados pessoais</h3>
              <div className=" flex space-x-5">
                <GoToField step={1} fieldName="name">
                  <TextField<OverviewSchema>
                    name="name"
                    readonly
                    label="Nome"
                  />
                </GoToField>
                {currentFormData.email && (
                  <GoToField step={1} fieldName="email">
                    <TextField<OverviewSchema>
                      name="email"
                      readonly
                      label="Email"
                    />
                  </GoToField>
                )}
                {currentFormData.phone && (
                  <GoToField step={1} fieldName="phone">
                    <TextField<OverviewSchema>
                      name="phone"
                      readonly
                      label="Numero para contato"
                      mask="phone"
                    />
                  </GoToField>
                )}
              </div>
              {currentFormData.homepage && (
                <div className="flex space-x-5">
                  <GoToField step={1} fieldName="homepage">
                    <TextField<OverviewSchema>
                      name="homepage"
                      readonly
                      label="Home page"
                    />
                  </GoToField>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <h3 className="text-zinc-500">Endereço</h3>
              <div className=" flex space-x-5">
                {currentFormData.zipCode && (
                  <GoToField step={2} fieldName="zipCode">
                    <TextField<OverviewSchema>
                      className="w-fit py-2"
                      name="zipCode"
                      readonly
                      label="CEP"
                    />
                  </GoToField>
                )}
              </div>
              <div className="flex space-x-5">
                <GoToField step={2} fieldName="address">
                  <TextField<OverviewSchema>
                    name="address"
                    readonly
                    label="Endereço"
                  />
                </GoToField>
                <GoToField step={2} fieldName="neighborhood">
                  <TextField<OverviewSchema>
                    name="neighborhood"
                    readonly
                    label="Bairro"
                  />
                </GoToField>
                <GoToField step={2} fieldName="houseNumber">
                  <TextField<OverviewSchema>
                    name="houseNumber"
                    readonly
                    label="Numero da casa"
                  />
                </GoToField>
              </div>
              <div className="flex space-x-5">
                <GoToField step={2} fieldName="city">
                  <TextField<OverviewSchema>
                    name="city"
                    readonly
                    label="Cidade"
                  />
                </GoToField>
                <GoToField step={2} fieldName="state">
                  <SelectField<OverviewSchema>
                    name="state"
                    label="Estado"
                    readonly
                    options={STATES}
                  />
                </GoToField>
                {currentFormData.cityCode && (
                  <GoToField step={2} fieldName="cityCode">
                    <TextField<OverviewSchema>
                      name="cityCode"
                      label="Codigo do Município"
                      readonly
                    />
                  </GoToField>
                )}
                {currentFormData.country && (
                  <GoToField step={2} fieldName="country">
                    <TextField<OverviewSchema>
                      name="country"
                      label="Pais"
                      readonly
                    />
                  </GoToField>
                )}
              </div>
            </div>
            {currentFormData.taxId && (
              <div className="space-y-3">
                <h3 className="text-zinc-500">Documento</h3>
                <div className="flex space-x-5">
                  {currentFormData.taxId && (
                    <GoToField step={1} fieldName="taxId">
                      <TextField<OverviewSchema>
                        name="taxId"
                        label="CPF/CNPJ"
                        mask="cpf/cnpj"
                        readonly
                      />
                    </GoToField>
                  )}
                  {currentFormData.openingDate &&
                    currentFormData.taxId?.length === 11 && (
                      <GoToField step={1} fieldName="openingDate">
                        <TextField<OverviewSchema>
                          name="openingDate"
                          label="Data de Nascimento"
                          mask="date"
                          readonly
                        />
                      </GoToField>
                    )}
                  {currentFormData.openingDate &&
                    currentFormData.taxId?.length === 14 && (
                      <GoToField step={1} fieldName="openingDate">
                        <TextField<OverviewSchema>
                          name="openingDate"
                          label="Data de Abertura"
                          mask="date"
                          readonly
                        />
                      </GoToField>
                    )}
                  {currentFormData.type && (
                    <GoToField step={1} fieldName="type">
                      <SelectField<OverviewSchema>
                        options={TYPES}
                        name="type"
                        label="Tipo de cadastro"
                        readonly
                      />
                    </GoToField>
                  )}
                </div>
                <div className="flex space-x-5">
                  {currentFormData.tradeName && (
                    <GoToField step={1} fieldName="tradeName">
                      <TextField<OverviewSchema>
                        name="tradeName"
                        label="Nome fantasia"
                        readonly
                      />
                    </GoToField>
                  )}
                </div>
              </div>
            )}
            <div className="flex gap-5 justify-end">
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
