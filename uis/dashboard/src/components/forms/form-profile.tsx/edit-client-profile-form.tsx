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
  formatDate,
  formatPhone,
  getInitials,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  AlertCircle,
  CalendarIcon,
  CheckIcon,
  EditIcon,
  GlobeIcon,
  Loader2,
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
import { useCnpj } from "@/hooks/use-cnpj";
import { useCep } from "@/hooks/use-cep";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiUpdateClientProfile } from "@/api/endpoints";

import { InvoiceList } from "./invoice-list";
import { TableSheet } from "@/components/tables/table-sheet";
import { AnimatePresence, motion } from "framer-motion";

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
          {import.meta.env.VITE_APP_VERSION !== "aula" && (
            <TableSheet client={client}>
              <Button variant="outline" size={"sm"}>
                Arquivos
              </Button>
            </TableSheet>
          )}
        </div>
      </div>
      <div
        className={cn(
          import.meta.env.VITE_APP_VERSION !== "aula" &&
            "grid md:grid-cols-5 gap-4"
        )}>
        <Card
          className={cn(
            import.meta.env.VITE_APP_VERSION !== "aula"
              ? "w-full md:col-span-3"
              : "w-full"
          )}>
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
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    scale: 1,
                    transition: {
                      duration: 0.4,
                      ease: "easeOut",
                      height: { duration: 0.4 },
                      opacity: { duration: 0.3, delay: 0.1 },
                      scale: { duration: 0.3, delay: 0.1 },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    scale: 0.95,
                    transition: {
                      duration: 0.3,
                      ease: "easeIn",
                    },
                  }}
                  style={{ overflow: "hidden" }}>
                  <FormWrapper method={methods}>
                    <form
                      id="form_update_client_profile"
                      onSubmit={methods.handleSubmit(onSubmit)}>
                      <motion.div
                        className="space-y-6"
                        initial={{ y: 20 }}
                        animate={{
                          y: 0,
                          transition: { duration: 0.3, delay: 0.2 },
                        }}>
                        <motion.div
                          className="space-y-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.3, delay: 0.3 },
                          }}>
                          <h3 className="text-sm font-medium mb-3 text-blue-600 dark:text-blue-400">
                            Informações Básicas
                          </h3>
                          {!client.taxId && (
                            <motion.p
                              className="text-red-500/60 text-sm inline-flex items-center"
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: { delay: 0.4 },
                              }}>
                              Registre algum documento{" "}
                              <AlertCircle className="size-5 ml-2" />
                            </motion.p>
                          )}

                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                              transition: {
                                duration: 0.3,
                                delay: 0.4,
                                staggerChildren: 0.1,
                              },
                            }}>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}>
                              <TextField<UpdateClientProfileSchema>
                                name="name"
                                label="Nome"
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}>
                              <SelectField<UpdateClientProfileSchema>
                                name="status"
                                label="Status"
                                options={STATUS_OPTIONS}
                              />
                            </motion.div>

                            {!client.taxId && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}>
                                <TextField<UpdateClientProfileSchema>
                                  name="taxId"
                                  label="CPF/CNPJ"
                                  mask="cpf/cnpj"
                                  changeInterceptor={handleCpfCnpj}
                                />
                              </motion.div>
                            )}

                            {client.taxId && client.taxId.length === 11 && (
                              <motion.div
                                className="space-y-1 opacity-60 scale-99 pointer-events-none"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 0.6, y: 0 }}>
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
                              </motion.div>
                            )}

                            {client.taxId && client.taxId.length === 14 && (
                              <motion.div
                                className="space-y-1 opacity-60 scale-99 pointer-events-none"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 0.6, y: 0 }}>
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
                              </motion.div>
                            )}

                            {client.taxId && client.taxId.length === 11 && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}>
                                <TextField<UpdateClientProfileSchema>
                                  name="openingDate"
                                  label="Data de nascimento"
                                  mask="date"
                                />
                              </motion.div>
                            )}

                            {client.taxId && client.taxId.length === 14 && (
                              <motion.div
                                className="space-y-1 opacity-60 scale-99 pointer-events-none"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 0.6, y: 0 }}>
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
                              </motion.div>
                            )}

                            {client.taxId &&
                              [11, 14].includes(client.taxId.length) && (
                                <motion.div
                                  className="space-y-1 opacity-60 scale-99 pointer-events-none"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 0.6, y: 0 }}>
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
                                </motion.div>
                              )}

                            {client.taxId && client.taxId.length === 14 && (
                              <motion.div
                                className="space-y-1 opacity-60 scale-99 pointer-events-none"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 0.6, y: 0 }}>
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
                              </motion.div>
                            )}

                            {!client.taxId &&
                              taxIdWatch &&
                              [11, 14].includes(taxIdWatch.length) && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}>
                                  <SelectField<UpdateClientProfileSchema>
                                    name="type"
                                    label="Tipo de cadastro"
                                    options={TYPES}
                                    readonly
                                    required
                                  />
                                </motion.div>
                              )}

                            {!client.taxId &&
                              taxIdWatch &&
                              taxIdWatch.length === 11 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}>
                                  <TextField<UpdateClientProfileSchema>
                                    name="openingDate"
                                    label="Data de nascimento"
                                    mask="date"
                                  />
                                </motion.div>
                              )}

                            {!client.taxId &&
                              taxIdWatch &&
                              taxIdWatch.length === 14 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}>
                                  <TextField<UpdateClientProfileSchema>
                                    name="openingDate"
                                    label="Data de abertura"
                                    mask="date"
                                    isLoading={isFetchingCnpj}
                                  />
                                </motion.div>
                              )}

                            {!client.taxId &&
                              taxIdWatch &&
                              taxIdWatch.length === 14 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}>
                                  <TextField<UpdateClientProfileSchema>
                                    name="tradeName"
                                    label="Nome fantasia"
                                    isLoading={isFetchingCnpj}
                                  />
                                </motion.div>
                              )}
                          </motion.div>
                        </motion.div>

                        <Separator />

                        <motion.div
                          className="space-y-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.3, delay: 0.5 },
                          }}>
                          <h3 className="text-sm font-medium mb-3 text-blue-600 dark:text-blue-400">
                            Informações de Contato
                          </h3>
                          {(!client.email || !client.phone) && (
                            <motion.p
                              className="text-red-500/60 text-sm inline-flex items-center"
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: { delay: 0.6 },
                              }}>
                              Complete as informações de contanto{" "}
                              <AlertCircle className="size-5 ml-2" />
                            </motion.p>
                          )}

                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                              transition: {
                                duration: 0.3,
                                delay: 0.6,
                                staggerChildren: 0.1,
                              },
                            }}>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}>
                              <TextField<UpdateClientProfileSchema>
                                name="email"
                                label="Email"
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}>
                              <TextField<UpdateClientProfileSchema>
                                name="phone"
                                mask="phone"
                                label="Telefone"
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}>
                              <TextField<UpdateClientProfileSchema>
                                name="homepage"
                                label="Website"
                              />
                            </motion.div>
                          </motion.div>
                        </motion.div>

                        <Separator />

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.3, delay: 0.7 },
                          }}>
                          <h3 className="text-sm font-medium mb-3 text-blue-600 dark:text-blue-400">
                            Endereço
                          </h3>
                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                              transition: {
                                duration: 0.3,
                                delay: 0.8,
                                staggerChildren: 0.1,
                              },
                            }}>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}>
                              <TextField<UpdateClientProfileSchema>
                                name="zipCode"
                                label="CEP"
                                mask="cep"
                                changeInterceptor={handleCep}
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}>
                              <TextField<UpdateClientProfileSchema>
                                name="address"
                                label="Endereço"
                                required
                                isLoading={isFetchingCep}
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}>
                              <TextField<UpdateClientProfileSchema>
                                name="houseNumber"
                                label="Numero da casa"
                                required
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}>
                              <TextField<UpdateClientProfileSchema>
                                name="neighborhood"
                                label="Bairro"
                                isLoading={isFetchingCep}
                                required
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}>
                              <TextField<UpdateClientProfileSchema>
                                name="city"
                                label="Cidade"
                                isLoading={isFetchingCep}
                                required
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}>
                              <TextField<UpdateClientProfileSchema>
                                name="cityCode"
                                isLoading={isFetchingCep}
                                label="Código do município"
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}>
                              <SelectField<UpdateClientProfileSchema>
                                name="state"
                                label="Estado"
                                options={STATES}
                                required
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}>
                              <SelectField<UpdateClientProfileSchema>
                                options={COUNTRIES}
                                name="country"
                                label="País"
                              />
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </form>
                  </FormWrapper>
                </motion.div>
              ) : (
                <motion.div
                  key="viewing"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    transition: { duration: 0.2, ease: "easeIn" },
                  }}
                  style={{ overflow: "hidden" }}>
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
                                <span className="text-sm font-medium">
                                  Email:
                                </span>
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
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, delay: 0.5 },
              }}
              exit={{
                opacity: 0,
                y: 20,
                transition: { duration: 0.2 },
              }}>
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
            </motion.div>
          )}
        </Card>
        {import.meta.env.VITE_APP_VERSION !== "aula" && (
          <InvoiceList client={client} />
        )}
      </div>
    </div>
  );
};
