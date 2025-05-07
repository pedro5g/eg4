import { Client } from "@/api/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormWrapper } from "@/components/rhf/form-wrapper";
import { TextField } from "@/components/rhf/text-field";
import { SelectField } from "@/components/rhf/select-field";
import { STATES } from "@/constants";

interface FormProfileProps {
  client: Client;
}

export const FormProfile = ({ client }: FormProfileProps) => {
  const methods = useForm({
    // resolver: zodResolver(registerClientSchema),
    defaultValues: {
      name: client.name || "",
      email: client.email || "",
      phone:
        (client?.areaCode && client?.phone && client.areaCode + client.phone) ||
        "",
      areaCode: client.areaCode || "",
      zipCode: client.zipCode || "",
      neighborhood: client.neighborhood || "",
      address: client.address || "",
      city: client.city || "",
      cityCode: client.cityCode || "",
      country: client.country || "",
      state: client.state || "",
      taxId: client.taxId || "",
      openingDate: client.openingDate || "",
      tradeName: client.tradeName || "",
      type: client.type || "",
      status: client.status || "ACTIVE",
      homepage: client.homepage || "",
      storeCode: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
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
              {client?.email && (
                <TextField<RegisterClientSchemaType>
                  name="email"
                  readonly
                  label="Email"
                />
              )}
              {client?.phone && (
                <TextField<RegisterClientSchemaType>
                  name="phone"
                  readonly
                  label="Numero para contato"
                  mask="phone"
                />
              )}
            </div>
            {client?.homepage && (
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
              {client?.zipCode && (
                <TextField<RegisterClientSchemaType>
                  className="w-fit py-2"
                  name="zipCode"
                  readonly
                  label="CEP"
                />
              )}
            </div>
            <div className="flex space-x-5">
              {client?.address && (
                <TextField<RegisterClientSchemaType>
                  name="address"
                  readonly
                  label="Endereço"
                />
              )}
              {client?.neighborhood && (
                <TextField<RegisterClientSchemaType>
                  name="neighborhood"
                  readonly
                  label="Bairro"
                />
              )}
              {client?.city && (
                <TextField<RegisterClientSchemaType>
                  name="city"
                  readonly
                  label="Cidade"
                />
              )}
            </div>
            <div className="flex space-x-5">
              {client?.state && (
                <SelectField<RegisterClientSchemaType>
                  name="state"
                  label="Estado"
                  readonly
                  options={STATES}
                />
              )}
              {client?.cityCode && (
                <TextField<RegisterClientSchemaType>
                  name="cityCode"
                  label="Codigo do Município"
                  readonly
                />
              )}
              {client?.country && (
                <TextField<RegisterClientSchemaType>
                  name="country"
                  label="Pais"
                  readonly
                />
              )}
            </div>
          </div>
          {client?.taxId && (
            <div className="space-y-3">
              <h3 className="text-zinc-500">Documento</h3>
              <div className="flex space-x-5">
                {client?.taxId && (
                  <TextField<RegisterClientSchemaType>
                    name="taxId"
                    label="CPF/CNPJ"
                    mask="cpf/cnpj"
                    readonly
                  />
                )}
                {client?.openingDate && client?.taxId?.length === 11 && (
                  <TextField<RegisterClientSchemaType>
                    name="openingDate"
                    label="Data de Nascimento"
                    mask="date"
                    readonly
                  />
                )}
                {client?.openingDate && client?.taxId?.length === 14 && (
                  <TextField<RegisterClientSchemaType>
                    name="openingDate"
                    label="Data de Abertura"
                    mask="date"
                    readonly
                  />
                )}
                {client?.type && (
                  <TextField<RegisterClientSchemaType>
                    name="type"
                    label="Tipo de cadastro"
                    readonly
                  />
                )}
              </div>
              <div className="flex space-x-5">
                {client?.tradeName && (
                  <TextField<RegisterClientSchemaType>
                    name="tradeName"
                    label="Nome fantasia"
                    readonly
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <div>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
            Editar
            {/* {isPending && <Loader2 size={16} className="animate-spin" />} */}
          </Button>
        </div>
      </form>
    </FormWrapper>
  );
};
