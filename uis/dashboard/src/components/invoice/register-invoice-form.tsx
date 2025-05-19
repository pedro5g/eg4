import {
  Barcode,
  DollarSign,
  Eye,
  FileText,
  Loader2,
  PackageIcon,
  ReceiptIcon,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency, formatPhone, randomString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormWrapper } from "../rhf/form-wrapper";
import { TextField } from "../rhf/text-field";
import { CalendarField } from "../rhf/calendar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClientProfile, ApiRegisterInvoice } from "@/api/endpoints";
import { Client } from "@/api/types";
import { useEffect, useState } from "react";
import { ClientMicroCard } from "./client-micro-card";
import { Skeleton } from "../ui/skeleton";
import { SelectClient } from "./select-client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useGenPdf } from "@/hooks/use-gen-pdf";

const formSchema = z.object({
  clientId: z.string().trim().min(1, "Selecione um cliente"),
  number: z.string().length(13, {
    message: "O numero da fatura precisa ter 13 números",
  }),
  product: z
    .string({ required_error: "O nome do produto é um campo obrigatório" })
    .min(2, {
      message: "O nome do produto precisa ter no mínimo 2 letras",
    }),
  amount: z.string({
    required_error: "Valor é um campo obrigatório",
    message: "O valor precisa ser um numero positivo",
  }),
  issueDate: z.date({
    required_error: "Data de emissão é obrigatório",
  }),
  dueDate: z
    .date({
      required_error: "Data de vencimento é obrigatório",
    })
    .refine((date) => date > new Date(), {
      message: "Data de vencimento deve ser uma data futura",
    }),
});
export type RegisterInvoiceFormSchema = z.infer<typeof formSchema>;

interface RegisterInvoiceFormProps {
  clientCode?: string;
}

export function RegisterInvoiceForm({ clientCode }: RegisterInvoiceFormProps) {
  const [showActions, setShowActions] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const queryClient = useQueryClient();

  const form = useForm<RegisterInvoiceFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      number: randomString(13, "n"),
      product: "",
      amount: "0.00",
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  const watchedValues = form.watch();

  const { handlerDownloadPdf, PdfTemplateHidden } = useGenPdf({
    client: selectedClient,
    invoice: {
      ...watchedValues,
    },
  });

  const {
    data,
    isPending: isPendingGetClient,
    isError: isErrorGetClient,
  } = useQuery({
    queryFn: () => ApiClientProfile(clientCode!),
    queryKey: ["client-profile", clientCode],
    enabled: !!clientCode,
  });

  useEffect(() => {
    if (data) {
      setSelectedClient(data.client);
      form.setValue("clientId", data.client.id);
    }
  }, [data, isPendingGetClient]);

  function resetForm() {
    form.reset({
      clientId: clientCode && data?.client.id,
      number: randomString(13, "n"),
      product: "",
      amount: "0.00",
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterInvoiceFormSchema) => ApiRegisterInvoice(data),
    onSuccess: async ({ ok }, { number, product }) => {
      if (ok) {
        window.toast.success("Fatura registrada com sucesso!", {
          description: `A fatura nº ${number} para ${product} foi criada.`,
          duration: 5000,
          classNames: {
            description: "text-xs",
          },
        });
        await queryClient.refetchQueries({
          queryKey: ["client-invoices", selectedClient?.id],
        });
        setShowActions(true);
      }
    },
    onError: (error) => {
      console.error(error);
      window.toast.error("Erro ao registrar uma fatura");
    },
  });

  async function downloadPdf() {
    await handlerDownloadPdf();
    resetForm();
    setShowActions(false);
  }

  async function onSubmit(data: RegisterInvoiceFormSchema) {
    if (isPending) return;
    mutate(data);
  }

  return (
    <div className="grid gap-8 md:grid-cols-5">
      <Card className="md:col-span-3 border-blue-100 shadow-lg overflow-hidden h-fit p-0">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ReceiptIcon className="h-5 w-5" />
            Informações da fatura
          </h2>
          <p className="text-blue-100 mt-1">
            Insira os detalhes da sua nova fatura
          </p>
        </div>

        <CardContent className="p-6">
          <FormWrapper method={form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (error) =>
                console.log(error)
              )}
              className="space-y-6">
              <div className="space-y-4">
                <TextField<RegisterInvoiceFormSchema>
                  IconLeft={() => <Barcode className="size-4" />}
                  name="number"
                  label="Código da fatura"
                  readonly
                />
                <div className="flex flex-col">
                  <label className="text-blue-700 font-medium">Cliente</label>
                  {clientCode && selectedClient && isPendingGetClient && (
                    <Skeleton className="bg-blue-50 rounded-lg p-3 border border-blue-100 w-full animate-pulse h-24" />
                  )}
                  <div className="grid gap-4 transition-all duration-300 ease-in-out">
                    {clientCode &&
                      selectedClient &&
                      !isPendingGetClient &&
                      !isErrorGetClient && (
                        <ClientMicroCard
                          name={selectedClient.name}
                          address={selectedClient.address}
                          areaCode={selectedClient.areaCode}
                          phone={selectedClient.phone}
                          email={selectedClient.email}
                          type={selectedClient.type}
                        />
                      )}
                    {!clientCode && selectedClient && (
                      <ClientMicroCard
                        name={selectedClient.name}
                        address={selectedClient.address}
                        areaCode={selectedClient.areaCode}
                        phone={selectedClient.phone}
                        email={selectedClient.email}
                        type={selectedClient.type}
                      />
                    )}

                    {(!clientCode || isErrorGetClient) && (
                      <SelectClient<RegisterInvoiceFormSchema>
                        name="clientId"
                        selectedClient={selectedClient}
                        setSelectedClient={setSelectedClient}
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField<RegisterInvoiceFormSchema>
                    name="product"
                    label="Nome do produto"
                    IconLeft={() => <PackageIcon className="size-4" />}
                    required
                  />

                  <TextField<RegisterInvoiceFormSchema>
                    mask="currency"
                    name="amount"
                    label="Valor"
                    IconLeft={() => <DollarSign className="size-4" />}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CalendarField<RegisterInvoiceFormSchema>
                    name="issueDate"
                    label="Data de emissão"
                    disable={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                  <CalendarField<RegisterInvoiceFormSchema>
                    name="dueDate"
                    label="Data de vencimento"
                    disable={(date) => date < new Date()}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300">
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                  Registrar fatura
                </Button>
              </div>
            </form>
          </FormWrapper>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 border-blue-100 shadow-lg h-fit pt-0">
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-6 text-white">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Eye className="size-5" />
            Pre visualização da fatura
          </h2>
          <p className="text-blue-100 mt-1">Veja como ficará sua fatura</p>
        </div>

        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="bg-blue-100 rounded-full p-2">
                <FileText className="size-6 text-blue-500" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold text-gray-900">Fatura</h3>
                <p className="text-sm text-gray-500">
                  #{watchedValues.number || "0000000000000"}
                </p>
              </div>
            </div>

            {selectedClient ? (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <h4 className="text-sm font-medium text-blue-700 mb-1">
                  PARA:
                </h4>
                <div className="text-sm font-medium">{selectedClient.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {selectedClient.address}
                </div>
                {selectedClient.email && (
                  <div className="text-xs text-gray-600 ">
                    {selectedClient.email}
                  </div>
                )}
                {selectedClient.phone && selectedClient.areaCode && (
                  <div className="text-xs text-gray-600">
                    {formatPhone(
                      selectedClient.areaCode + selectedClient.phone
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-center">
                <p className="text-sm text-blue-700">
                  Selecione um cliente para ver as informações de cobrança
                </p>
              </div>
            )}

            <Separator className="my-4 bg-blue-100" />

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Produto:</span>
                <span className="font-medium text-gray-900">
                  {watchedValues.product || "Nome do produto"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Valor:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(watchedValues.amount.toString())}
                </span>
              </div>
            </div>

            <Separator className="my-4 bg-blue-100" />

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Data de emissão:</span>
                <span className="font-medium text-gray-900">
                  {watchedValues.issueDate
                    ? format(watchedValues.issueDate, "dd MMMM, yyyy", {
                        locale: ptBR,
                      })
                    : "Not set"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Data de vencimento:</span>
                <span className="font-medium text-gray-900">
                  {watchedValues.dueDate
                    ? format(watchedValues.dueDate, "dd MMMM, yyyy", {
                        locale: ptBR,
                      })
                    : "Not set"}
                </span>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total:</span>
                <span className="text-xl font-bold text-blue-700">
                  {formatCurrency(watchedValues.amount.toString())}
                </span>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-4">
              Esta é uma prévia da sua fatura.
            </div>
          </div>
          <div className="pt-4 flex items-center justify-between">
            {showActions && (
              <>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    resetForm();
                    form.setFocus("product");
                    setShowActions(false);
                  }}>
                  Cadastra nova fatura
                </Button>
                <Button
                  type="button"
                  onClick={downloadPdf}
                  className=" bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300">
                  Baixar pdf
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      {<PdfTemplateHidden />}
    </div>
  );
}
