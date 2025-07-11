import { FormWrapper } from "@/components/rhf/form-wrapper";
import { useForm } from "react-hook-form";
import {
  overviewSchema,
  OverviewSchema,
} from "./schemas/register-client-form.schema";
import { TextField } from "@/components/rhf/text-field";
import { SelectField } from "@/components/rhf/select-field";
import { COUNTRIES, STATES, TYPES } from "@/constants";
import { Button } from "@/components/ui/button";
import { useStepsControl } from "@/components/forms/register-client-form/hooks/use-steps-control";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiRegisterClient } from "@/api/endpoints";
import { Loader2, RefreshCcw } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMultiStepsForm } from "./hooks/use-multi-steps-form";
import { GoToField } from "./go-to-field";
import { ApiError } from "@/api/types";
import { AnimationDiv } from "./animation-div";
import { useGetStores } from "@/hooks/use-get-stores";

export const Overview = ({ direction }: { direction: number }) => {
  const { navigate, removeFocus } = useStepsControl();
  const { currentFormData, clearFormData, clear } = useMultiStepsForm();
  const { data } = useGetStores();
  const queryClient = useQueryClient();

  const selectedStore = (data?.stores || []).find(
    (store) => store.code === currentFormData.storeCode
  );

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
      type: currentFormData.type ?? "F",
      status: "ACTIVE",
      homepage: currentFormData.homepage,
      storeCode: currentFormData.storeCode,
      houseNumber:
        currentFormData.address && currentFormData.address.split("n°")[1],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: OverviewSchema) => ApiRegisterClient(data),
    onSuccess: async ({ ok }) => {
      if (ok) {
        window.toast.success("Cliente cadastrado com sucesso");
        await queryClient.refetchQueries({
          queryKey: ["list-clients"],
        });
        await queryClient.refetchQueries({
          queryKey: ["summary"],
        });
        clearFormData();
        navigate(1);
        removeFocus();
      }
    },
    onError: (error: ApiError) => {
      console.log(error);

      if (error.errorCode) {
        if (error.errorCode === "TAXID_ALREADY_REGISTERED") {
          methods.setError("taxId", {
            message: `Já existe um cliente registrado com este ${
              currentFormData.taxId?.length === 11 ? "cpf" : "cnpj"
            }`,
          });
          return;
        }
      }
      window.toast.error("Erro, por favor tente mais tarde");
    },
  });

  const onSubmit = (data: OverviewSchema) => {
    if (isPending) return;
    mutate(data);
  };

  return (
    <AnimationDiv direction={direction}>
      <div className="grid w-full h-full space-y-5">
        <div>
          <div className="inline-flex items-center gap-5">
            <h2 className="text-zinc-800 dark:text-zinc-100 text-2xl font-bold">
              Overview
            </h2>
            <button
              type="button"
              onClick={clear}
              className="text-zinc-800 dark:text-zinc-100 cursor-pointer">
              <RefreshCcw size={20} />
              <span className="sr-only">Limpar o formulário</span>
            </button>
          </div>
          <p className="text-zinc-400">Clique no campo para ir até ele</p>
        </div>
        <FormWrapper method={methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit, (data) => {
              console.log(data);
            })}
            className="w-full">
            <div className="grid space-y-4 w-full py-4">
              <div className="flex space-x-5">
                <GoToField step={1} fieldName="storeCode">
                  <TextField<OverviewSchema>
                    className="w-fit py-2"
                    name="storeCode"
                    readonly
                    label="Loja"
                    value={selectedStore?.name}
                  />
                </GoToField>
              </div>
              <div className="space-y-3">
                <h3 className="text-zinc-500">Dados pessoais</h3>
                <div className="flex md:flex-row flex-col gap-4">
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
                  <GoToField step={1} fieldName="homepage">
                    <TextField<OverviewSchema>
                      name="homepage"
                      readonly
                      label="Home page"
                    />
                  </GoToField>
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-zinc-500">Endereço</h3>
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
                <div className="flex md:flex-row flex-col gap-4">
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
                <div className="flex md:flex-row flex-col gap-4">
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
                      <SelectField<OverviewSchema>
                        name="country"
                        label="País"
                        options={COUNTRIES}
                        readonly
                      />
                    </GoToField>
                  )}
                </div>
              </div>
              {currentFormData.taxId && (
                <div className="space-y-3">
                  <h3 className="text-zinc-500">Documento</h3>
                  <div className="flex md:flex-row flex-col gap-4">
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
                  <div className="flex md:flex-row flex-col gap-4">
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
                  className="bg-blue-600 hover:bg-blue-700 dark:text-white cursor-pointer">
                  Cadastrar
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                </Button>
              </div>
            </div>
          </form>
        </FormWrapper>
      </div>
    </AnimationDiv>
  );
};
