import { ApiError, Client, UpdateClienteProfileBodyType } from "@/api/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormWrapper } from "@/components/rhf/form-wrapper";
import { TextField } from "@/components/rhf/text-field";
import { SelectField } from "@/components/rhf/select-field";
import { COUNTRIES, STATES, STATUS_MAP, TYPES } from "@/constants";
import { STATUS_ICON_MAP, STATUS_OPTIONS } from "@/constants/status-options";
import {
  UpdateClientProfileSchema,
  updateClientProfileSchema,
} from "../register-client-form/schemas/update-client-profile.schema";
import {
  cn,
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatCurrency,
  formatDate,
  formatPhone,
  getInitials,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCallback, useState } from "react";
import {
  AlertCircle,
  ArrowRightIcon,
  Barcode,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  EditIcon,
  GlobeIcon,
  Loader2,
  MailIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  TagIcon,
  UserIcon,
  XCircleIcon,
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
import { useCnpj } from "@/hooks/use-cnpj";
import { useCep } from "@/hooks/use-cep";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiListClientInvoices, ApiUpdateClientProfile } from "@/api/endpoints";
import { useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ptBR } from "date-fns/locale/pt-BR";

interface FormProfileProps {
  client: Client;
}

export const FormProfile = ({ client }: FormProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const methods = useForm({
    resolver: zodResolver(updateClientProfileSchema),
    defaultValues: {
      name: client.name,
      email: client.email || null,
      phone:
        (client?.areaCode && client?.phone && client.areaCode + client.phone) ||
        "",
      areaCode: client.areaCode || null,
      zipCode: client.zipCode || null,
      neighborhood: client.neighborhood || "",
      address: client.address.split("n°")[0] || "",
      city: client.city || "",
      cityCode: client.cityCode || "",
      country: client.country || "",
      state: client.state || "",
      taxId: client.taxId || null,
      openingDate: client.openingDate || null,
      tradeName: client.tradeName || null,
      type: client.type || null,
      status: client.status || "ACTIVE",
      homepage: client.homepage || "",
      houseNumber: client.address.split("n°")[1] || "",
    },
  });

  const { handleCpfCnpj, isFetchingCnpj } = useCnpj({
    setTaxId: (value) => methods.setValue("taxId", value),
    setTradeName: (value) => methods.setValue("tradeName", value),
    setOpeningDate: (value) => methods.setValue("openingDate", value),
    setType: (value) => methods.setValue("type", value),
    setTaxIdError: (error) => methods.setError("taxId", { message: error }),
    clearError: () => methods.clearErrors("taxId"),
    focusControl: () => methods.setFocus("taxId"),
  });

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

  const taxIdWatch = methods.watch("taxId");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateClienteProfileBodyType) =>
      ApiUpdateClientProfile(data),
    onSuccess: async ({ ok }) => {
      if (ok) {
        window.toast.success("Alterações aplicadas");
        await queryClient.refetchQueries({
          queryKey: ["client-profile", client.code],
        });
        await queryClient.refetchQueries({
          queryKey: ["list-clients"],
        });
        setIsEditing(false);
      }
    },
    onError: (error: ApiError) => {
      console.log(error);

      if (error.errorCode) {
        if (error.errorCode === "EMAIL_ALREADY_REGISTERED") {
          methods.setError("email", {
            message: "Já existe um cliente registrado com este e-mail",
          });
          return;
        }
        if (error.errorCode === "TAXID_ALREADY_REGISTERED") {
          methods.setError("taxId", {
            message: `Já existe um cliente registrado com este ${
              taxIdWatch && taxIdWatch.length === 11 ? "cpf" : "cnpj"
            }`,
          });
          return;
        }
      }
      window.toast.error("Erro, por favor tente mais tarde");
    },
  });

  const onSubmit = (data: UpdateClientProfileSchema) => {
    if (isPending || Object.keys(methods.formState.dirtyFields).length === 0)
      return;
    mutate({ code: client.code, ...data });
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
          <Badge variant="outline" className="text-muted-foreground px-4">
            {STATUS_MAP[client.status]}
            {STATUS_ICON_MAP[client.status]}
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
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="w-full md:col-span-3">
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

                  {client.tradeName && (
                    <CardDescription>{client.tradeName}</CardDescription>
                  )}
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
                            changeInterceptor={handleCpfCnpj}
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
                        {client.taxId && client.taxId.length === 11 && (
                          <TextField<UpdateClientProfileSchema>
                            name="openingDate"
                            label="Data de nascimento"
                            mask="date"
                          />
                        )}
                        {client.taxId && client.taxId.length === 14 && (
                          <div className="space-y-1 opacity-60 scale-99 pointer-events-none">
                            <TextField<UpdateClientProfileSchema>
                              name="openingDate"
                              label="Data de abertura"
                              readonly
                              mask="date"
                            />
                            <p className="text-muted-foreground text-sm inline-flex items-center">
                              Campo não editável
                              <AlertCircle className="size-5 ml-2" />
                            </p>
                          </div>
                        )}
                        {client.taxId &&
                          [11, 14].includes(client.taxId.length) && (
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
                        {client.taxId && client.taxId.length === 14 && (
                          <div className="space-y-1 opacity-60 scale-99 pointer-events-none">
                            <TextField<UpdateClientProfileSchema>
                              name="tradeName"
                              label="Nome fantasia"
                              readonly
                              isLoading={isFetchingCnpj}
                            />
                            <p className="text-muted-foreground text-sm inline-flex items-center">
                              Campo não editável
                              <AlertCircle className="size-5 ml-2" />
                            </p>
                          </div>
                        )}
                        {!client.taxId &&
                          taxIdWatch &&
                          [11, 14].includes(taxIdWatch.length) && (
                            <SelectField<UpdateClientProfileSchema>
                              name="type"
                              label="Tipo de cadastro"
                              options={TYPES}
                              readonly
                              required
                            />
                          )}
                        {!client.taxId &&
                          taxIdWatch &&
                          taxIdWatch.length === 11 && (
                            <TextField<UpdateClientProfileSchema>
                              name="openingDate"
                              label="Data de nascimento"
                              mask="date"
                            />
                          )}
                        {!client.taxId &&
                          taxIdWatch &&
                          taxIdWatch.length === 14 && (
                            <TextField<UpdateClientProfileSchema>
                              name="openingDate"
                              label="Data de abertura"
                              mask="date"
                              isLoading={isFetchingCnpj}
                            />
                          )}

                        {!client.taxId &&
                          taxIdWatch &&
                          taxIdWatch.length === 14 && (
                            <TextField<UpdateClientProfileSchema>
                              name="tradeName"
                              label="Nome fantasia"
                              isLoading={isFetchingCnpj}
                            />
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
                            name="zipCode"
                            label="CEP"
                            mask="cep"
                            changeInterceptor={handleCep}
                          />
                        </div>
                        <div>
                          <TextField<UpdateClientProfileSchema>
                            name="address"
                            label="Endereço"
                            required
                            isLoading={isFetchingCep}
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
                            isLoading={isFetchingCep}
                            required
                          />
                        </div>

                        <div>
                          <TextField<UpdateClientProfileSchema>
                            name="city"
                            label="Cidade"
                            isLoading={isFetchingCep}
                            required
                          />
                        </div>
                        <div>
                          <TextField<UpdateClientProfileSchema>
                            name="cityCode"
                            isLoading={isFetchingCep}
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
                          <SelectField<UpdateClientProfileSchema>
                            options={COUNTRIES}
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
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
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
                    {!client.email && !client.phone && !client.homepage ? (
                      <p className="text-red-500/80 text-sm inline-flex items-center">
                        Nenhuma informação para contato registrada
                        <AlertCircle className="size-5 ml-2" />
                      </p>
                    ) : (
                      <>
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
                            <span className="text-sm font-medium">
                              Telefone:
                            </span>
                            <span>
                              {formatPhone(client.areaCode + client.phone)}
                            </span>
                          </div>
                        )}

                        {client.homepage && (
                          <div className="flex items-center gap-2">
                            <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              Website:{" "}
                            </span>
                            <a
                              href={client.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline">
                              {client.homepage}
                            </a>
                          </div>
                        )}
                      </>
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
                      <div className="flex flex-col text-sm text-muted-foreground">
                        <span>{client.address}</span>
                        {client.neighborhood && (
                          <span>{client.neighborhood}</span>
                        )}
                        <span>
                          {client.city}, {client.state}{" "}
                          {client.zipCode &&
                            `CEP: ${formatCEP(client.zipCode)}`}
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
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => setIsEditing(false)}>
                <XIcon className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                form="form_update_client_profile"
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                disabled={
                  Object.keys(methods.formState.dirtyFields).length === 0
                }>
                {isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckIcon className="h-4 w-4 mr-2" />
                )}
                Salvar Alterações
              </Button>
            </CardFooter>
          )}
        </Card>
        <InvoicesCard clientCode={client.code} clientId={client.id} />
      </div>
    </div>
  );
};

interface InvoicesCardProps {
  clientId: string;
  clientCode: string;
}

export const InvoicesCard = ({ clientId, clientCode }: InvoicesCardProps) => {
  const navigate = useNavigate();
  const { data, isPending } = useQuery({
    queryFn: () => ApiListClientInvoices({ clientId }),
    queryKey: ["client-invoices", clientId],
  });

  const getDueDays = useCallback((dueDate: Date | string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `Vence em ${diffDays} dia${diffDays !== 1 ? "s" : ""}`;
    } else if (diffDays < 0) {
      return `${Math.abs(diffDays)} dia${
        Math.abs(diffDays) !== 1 ? "s" : ""
      } atrasada`;
    } else {
      return "Com vencimento hoje";
    }
  }, []);

  return (
    <Card className="md:col-span-2 max-h-svh">
      <CardHeader>
        <CardTitle className="text-2xl">Faturas do cliente</CardTitle>
        <CardDescription className="text-xs">
          Todas as faturas do cliente são listadas aqui
        </CardDescription>
        <Button
          size="sm"
          onClick={() => {
            navigate(`/invoice/${clientCode}`);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white">
          Cadastrar Fatura
        </Button>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className=" w-full space-y-2 max-h-[400px] scroll-py-1 overflow-x-hidden overflow-y-auto">
          {isPending ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                className="flex-col space-y-2 px-3 items-center space-x-4 border bg-blue-100 rounded-md animate-pulse py-2"
                key={i}>
                <div className="flex items-center justify-center space-x-4">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-[100px]" />
                    <Skeleton className="h-3 w-[50px]" />
                  </div>
                  <div className="ml-auto mb-auto">
                    <Skeleton className=" h-3 w-[50px]" />
                  </div>
                </div>
                <Separator className="my-2" />
                <Skeleton className="h-1 w-[250px]" />
                <Skeleton className="h-1 w-[250px]" />
              </div>
            ))
          ) : data?.invoices?.length === 0 ? (
            <div>
              <p>Nenhuma fatura cadastrada</p>
            </div>
          ) : (
            (data?.invoices || []).map((invoice) => (
              <Card
                key={invoice.id}
                className="group overflow-hidden transition-all hover:shadow-md py-2">
                <div className="relative">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center mr-3",
                            invoice.status === "PAID"
                              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                              : invoice.status === "CANCELED"
                              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          )}>
                          {invoice.status === "PAID" ? (
                            <CheckCircleIcon className="h-4 w-4" />
                          ) : invoice.status === "CANCELED" ? (
                            <XCircleIcon className="h-4 w-4" />
                          ) : (
                            <ClockIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm inline-flex gap-1 items-center">
                            <Barcode className="size-4" />
                            {invoice.number}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {invoice.product}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-base">
                          {formatCurrency(invoice.amount.toString())}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getDueDays(invoice.dueDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <div className="text-xs text-muted-foreground">
                        <p>
                          Emitida:{" "}
                          {format(invoice.issueDate, "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </p>
                        <p>
                          Vencimento:{" "}
                          {format(invoice.dueDate, "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          Visualizar
                          <ArrowRightIcon className="ml-1 h-3.5 w-3.5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7">
                              <MoreHorizontalIcon className="h-3.5 w-3.5" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Download do PDF</DropdownMenuItem>
                            <DropdownMenuItem>Enviar lembrete</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              Deletar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
