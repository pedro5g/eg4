import { Client } from "@/api/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormWrapper } from "@/components/rhf/form-wrapper";
import { TextField } from "@/components/rhf/text-field";
import { SelectField } from "@/components/rhf/select-field";
import {
  STATES,
  STATUS_MAP,
  STATUS_OPTIONS,
  STYLE_STATUS_MAP,
  TYPES,
} from "@/constants";
import {
  UpdateClientProfileSchema,
  updateClientProfileSchema,
} from "../register-client-form/schemas/update-client-profile.schema";
import {
  cn,
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatDate,
  formatPhone,
  getInitials,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  AlertCircle,
  Building2Icon,
  CalendarIcon,
  CheckIcon,
  EditIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TagIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface FormProfileProps {
  client: Client;
}

export const FormProfile = ({ client }: FormProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const methods = useForm({
    resolver: zodResolver(updateClientProfileSchema),
    defaultValues: {
      name: client.name,
      email: client.email || null,
      phone:
        (client?.areaCode &&
          client?.phone &&
          formatPhone(client.areaCode + client.phone)) ||
        "",
      areaCode: client.areaCode || null,
      zipCode: client.zipCode || null,
      neighborhood: client.neighborhood || "",
      address: client.address.split("n°")[0] || "",
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
      houseNumber: client.address.split("n°")[1] || "",
    },
  });
  const taxIdWatch = methods.watch("taxId");
  const onSubmit = (data: UpdateClientProfileSchema) => {
    console.log(data);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Perfil do Cliente</h1>
          <p className="text-muted-foreground">
            Visualizar e gerenciar informações do cliente
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "px-3 border-2",
              STYLE_STATUS_MAP[client.status || "ACTIVE"]
            )}>
            {STATUS_MAP[client.status || "ACTIVE"]}
          </Badge>
          <Button
            variant={isEditing ? "outline" : "default"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            disabled={isEditing}
            className="bg-blue-600 hover:bg-blue-700 text-white">
            <EditIcon className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" alt={client.name} />
                <AvatarFallback className="bg-blue-50 dark:bg-blue-950">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{client.name}</CardTitle>
                <CardDescription>
                  {client.tradeName || client.name}
                </CardDescription>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Código: {client.code}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <FormWrapper method={methods}>
              <form
                id="form_update_client_profile"
                onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium mb-3 text-blue-600 dark:text-blue-400">
                      Informações Básicas
                    </h3>
                    {!client.taxId && (
                      <p className="text-red-500/60 text-sm inline-flex items-center">
                        Registre algum documento{" "}
                        <AlertCircle className="size-5 ml-2" />
                      </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <TextField<UpdateClientProfileSchema>
                          name="name"
                          label="Nome"
                        />
                      </div>
                      <div>
                        <SelectField<UpdateClientProfileSchema>
                          name="status"
                          label="Status"
                          options={STATUS_OPTIONS}
                        />
                      </div>
                      {!client.taxId && (
                        <TextField<UpdateClientProfileSchema>
                          name="taxId"
                          label="CPF/CNPJ"
                          mask="cpf/cnpj"
                        />
                      )}
                      {client.taxId && client.taxId.length === 11 && (
                        <div className="space-y-1 opacity-60 scale-99 pointer-events-none">
                          <TextField<UpdateClientProfileSchema>
                            name="taxId"
                            label="CPF"
                            mask="cpf/cnpj"
                            readonly
                          />
                          <p className="text-muted-foreground text-sm inline-flex items-center">
                            Campo não editável
                            <AlertCircle className="size-5 ml-2" />
                          </p>
                        </div>
                      )}
                      {client.taxId && client.taxId.length === 14 && (
                        <div className="space-y-1 opacity-60 scale-99 pointer-events-none">
                          <TextField<UpdateClientProfileSchema>
                            name="taxId"
                            label="CNPJ"
                            mask="cpf/cnpj"
                            readonly
                          />
                          <p className="text-muted-foreground text-sm inline-flex items-center">
                            Campo não editável
                            <AlertCircle className="size-5 ml-2" />
                          </p>
                        </div>
                      )}
                      {taxIdWatch && taxIdWatch.length === 11 && (
                        <div className="space-y-1 opacity-60 scale-99 pointer-events-none">
                          <TextField<UpdateClientProfileSchema>
                            name="openingDate"
                            label="Data de nascimento"
                            mask="date"
                          />
                          <p className="text-muted-foreground text-sm inline-flex items-center">
                            Campo não editável
                            <AlertCircle className="size-5 ml-2" />
                          </p>
                        </div>
                      )}
                      {taxIdWatch && taxIdWatch.length === 14 && (
                        <div className="space-y-1 opacity-60 scale-99 pointer-events-none">
                          <TextField<UpdateClientProfileSchema>
                            name="openingDate"
                            label="Data de abertura"
                            mask="date"
                            // isLoading={isLoading}
                          />
                          <p className="text-muted-foreground text-sm inline-flex items-center">
                            Campo não editável
                            <AlertCircle className="size-5 ml-2" />
                          </p>
                        </div>
                      )}
                      {taxIdWatch && [11, 14].includes(taxIdWatch.length) && (
                        <div className="space-y-1 opacity-60 scale-99 pointer-events-none">
                          <SelectField<UpdateClientProfileSchema>
                            name="type"
                            label="Tipo de cadastro"
                            options={TYPES}
                            readonly
                            required
                          />
                          <p className="text-muted-foreground text-sm inline-flex items-center">
                            Campo não editável
                            <AlertCircle className="size-5 ml-2" />
                          </p>
                        </div>
                      )}
                      {taxIdWatch && taxIdWatch.length === 14 && (
                        <div className="space-y-1 opacity-60 scale-99 pointer-events-none">
                          <TextField<UpdateClientProfileSchema>
                            name="tradeName"
                            label="Nome fantasia"
                            readonly
                            // isLoading={isLoading}
                          />
                          <p className="text-muted-foreground text-sm inline-flex items-center">
                            Campo não editável
                            <AlertCircle className="size-5 ml-2" />
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium mb-3 text-blue-600 dark:text-blue-400">
                      Informações de Contato
                    </h3>
                    {(!client.email || !client.phone) && (
                      <p className="text-red-500/60 text-sm inline-flex items-center">
                        Complete as informações de contanto{" "}
                        <AlertCircle className="size-5 ml-2" />
                      </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        {!client.email && (
                          <TextField<UpdateClientProfileSchema>
                            name="email"
                            label="Email"
                          />
                        )}
                        {client.email && (
                          <div className="space-y-1 opacity-60 scale-99 pointer-events-none">
                            <TextField<UpdateClientProfileSchema>
                              name="email"
                              label="Email"
                              readonly
                            />
                            <p className="text-muted-foreground text-sm inline-flex items-center">
                              Campo não editável
                              <AlertCircle className="size-5 ml-2" />
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <TextField<UpdateClientProfileSchema>
                          name="phone"
                          mask="phone"
                          label="Telefone"
                        />
                      </div>
                      <div>
                        <TextField<UpdateClientProfileSchema>
                          name="homepage"
                          label="Website"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-3 text-blue-600 dark:text-blue-400">
                      Endereço
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <TextField<UpdateClientProfileSchema>
                          name="address"
                          label="Endereço"
                          required
                        />
                      </div>
                      <div>
                        <TextField<UpdateClientProfileSchema>
                          name="houseNumber"
                          label="Numero da casa"
                          required
                        />
                      </div>
                      <div>
                        <TextField<UpdateClientProfileSchema>
                          name="neighborhood"
                          label="Bairro"
                          required
                        />
                      </div>

                      <div>
                        <TextField<UpdateClientProfileSchema>
                          name="zipCode"
                          label="CEP"
                          mask="cep"
                        />
                      </div>
                      <div>
                        <TextField<UpdateClientProfileSchema>
                          name="city"
                          label="Cidade"
                          required
                        />
                      </div>
                      <div>
                        <TextField<UpdateClientProfileSchema>
                          name="cityCode"
                          label="Código do município"
                        />
                      </div>
                      <div>
                        <SelectField<UpdateClientProfileSchema>
                          name="state"
                          label="Estado"
                          options={STATES}
                          required
                        />
                      </div>
                      <div>
                        <TextField<UpdateClientProfileSchema>
                          name="country"
                          label="País"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </FormWrapper>
          ) : (
            <div className="space-y-6">
              <div>
                <h3
                  className={`text-sm font-medium mb-3 text-blue-600 dark:text-blue-400`}>
                  Informações Básicas
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2">
                    <Building2Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Nome:</span>
                    <span>{client.name}</span>
                  </div>

                  {client.tradeName && (
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Nome Fantasia:
                      </span>
                      <span>{client.tradeName}</span>
                    </div>
                  )}

                  {client.type && (
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Tipo de Registro:
                      </span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {client.type === "F"
                          ? "Pessoa Física"
                          : "Pessoa Jurídica"}
                      </span>
                    </div>
                  )}

                  {client.taxId && (
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {client.type === "F" ? "CPF:" : "CNPJ:"}
                      </span>
                      <span className="bg-blue-50 dark:bg-blue-950">
                        {client.type === "F"
                          ? formatCPF(client.taxId)
                          : formatCNPJ(client.taxId)}
                      </span>
                    </div>
                  )}

                  {client.openingDate && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {client.type === "F"
                          ? "Data de Nascimento:"
                          : "Data de Abertura:"}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {formatDate(client.openingDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-3 text-blue-600 dark:text-blue-400">
                  Informações de Contato
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Email:</span>
                      <span>{client.email}</span>
                    </div>
                  )}

                  {client.phone && client.areaCode && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Telefone:</span>
                      <span>{formatPhone(client.areaCode + client.phone)}</span>
                    </div>
                  )}

                  {client.homepage && (
                    <div className="flex items-center gap-2">
                      <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Website: </span>
                      <a
                        href={client.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline">
                        {client.homepage}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-3 text-blue-600 dark:text-blue-400">
                  Endereço
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm font-medium">Endereço:</span>
                    <div className="flex flex-col">
                      <span>{client.address}</span>
                      {client.neighborhood && (
                        <span>{client.neighborhood}</span>
                      )}
                      <span>
                        {client.city}, {client.state}
                        {", "}
                        {client.zipCode && `CEP: ${formatCEP(client.zipCode)}`}
                      </span>
                      {client.country && <span>{client.country}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2 pt-0">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <XIcon className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              form="form_update_client_profile"
              className="bg-blue-600 hover:bg-blue-700 text-white">
              <CheckIcon className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
