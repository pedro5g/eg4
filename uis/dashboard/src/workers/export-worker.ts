import { Client } from "@/api/types";
import { STATUS_MAP } from "@/constants";
import {
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatDate,
  formatPhone,
} from "@/lib/utils";
import { utils, write } from "xlsx";

console.log("load worker");
let config = {
  format: "xlsx",
  chunkSize: 1000,
  filename: "dados_exportados",
  title: "Dados Exportados",
};

let clientsData: Client[] = [];
let totalClients = 0;
let processedClients = 0;
let processingComplete = false;

function processData(data: any) {
  if (data.type === "info") {
    totalClients = data.totalCount;
    postMessage({
      type: "progress",
      data: { processed: processedClients, total: totalClients },
    });
  } else if (data.type === "data") {
    clientsData.push(...data.clients);
    processedClients += data.clients.length;
    postMessage({
      type: "progress",
      data: { processed: processedClients, total: totalClients },
    });
  } else if (data.type === "progress") {
    postMessage({
      type: "progress",
      data: { processed: data.processed, total: data.total },
    });
  } else if (data.type === "complete") {
    processingComplete = true;
  }
}

function exportToXLSX() {
  try {
    const data = clientsData.map((client) => {
      return {
        code: client.code,
        nome: client.name,
        email: client.email || "Email não informado",
        telefone:
          (client.phone && formatPhone(client.areaCode + client.phone)) ||
          "Telefone não informado",
        status: STATUS_MAP[client.status] || client.status,
        dd: client.areaCode || "Não informado",
        cep: (client.zipCode && formatCEP(client.zipCode)) || "Não informado",
        endereço: client.address || "Não informado",
        bairro: client.neighborhood || "Não informado",
        cidade: client.city,
        estado: client.state,
        "cpf/cnpj":
          (client.taxId &&
            (client.taxId.length === 11
              ? formatCPF(client.taxId)
              : formatCNPJ(client.taxId))) ||
          "Não informado",
        "Tipo do registro":
          (client.taxId &&
            (client.taxId.length === 11
              ? "Pessoa Física"
              : "Pessoa Jurídica")) ||
          "Não informado",
        "Data de nascimento":
          (client.openingDate && formatDate(client.openingDate)) ||
          "Não informado",
        "Data de abertura":
          (client.openingDate && formatDate(client.openingDate)) ||
          "Não informado",
        "Nome fantasia":
          (client.tradeName && client.tradeName) || "Não informado",
      };
    });

    const headers = {
      code: "Código",
      nome: "Nome",
      email: "Email",
      telefone: "Telefone",
      status: "Status",
      dd: "DDD",
      cep: "CEP",
      endereço: "Endereço",
      bairro: "Bairro",
      cidade: "Cidade",
      estado: "Estado",
      "cpf/cnpj": "CPF/CNPJ",
      "Tipo do registro": "Tipo do Registro",
      "Data de nascimento": "Data de Nascimento",
      "Data de abertura": "Data de Abertura",
      "Nome fantasia": "Nome Fantasia",
    };

    const wb = utils.book_new();

    const ws = utils.aoa_to_sheet([]);

    utils.sheet_add_aoa(ws, [[config.title]], { origin: "A1" });

    const headerRow = Object.values(headers);
    utils.sheet_add_aoa(ws, [headerRow], { origin: "A2" });

    utils.sheet_add_json(ws, data, {
      origin: "A3",
      skipHeader: true,
    });

    const columnWidths = [
      { wch: 10 },
      { wch: 25 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 10 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
    ];
    ws["!cols"] = columnWidths;

    if (!ws["!merges"]) ws["!merges"] = [];
    ws["!merges"].push({
      s: { r: 0, c: 0 },
      e: { r: 0, c: headerRow.length - 1 },
    });

    if (!ws["!rows"]) ws["!rows"] = [];
    ws["!rows"][0] = { hpt: 30 };

    utils.book_append_sheet(wb, ws, "Dados");

    const wbout = write(wb, { bookType: "xlsx", type: "array" });

    postMessage({
      type: "complete",
      data: {
        content: wbout,
        format: "xlsx",
        filename: `${config.filename}.xlsx`,
      },
    });
  } catch (error: any) {
    postMessage({
      type: "error",
      data: { message: `Error to generate XLSX: ${error.message}` },
    });
  }
}

function finalizeExport() {
  if (config.format === "xlsx") {
    exportToXLSX();
  }
}

self.onmessage = function (event) {
  const { type, data, config: newConfig } = event.data;

  switch (type) {
    case "init":
      if (newConfig) {
        config = { ...config, ...newConfig };
      }
      clientsData = [];
      totalClients = 0;
      processedClients = 0;
      processingComplete = false;
      break;

    case "process":
      processData(data);
      break;

    case "finalize":
      finalizeExport();
      break;

    case "cancel":
      clientsData = [];
      postMessage({
        type: "error",
        data: { message: "canceled export" },
      });
      break;
  }
};

export {};
