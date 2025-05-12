import { utils, writeFile } from "xlsx";
import { STATUS_MAP } from "@/constants";
import {
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatDate,
  formatPhone,
} from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import { Client } from "@/api/types";

export const exportCustomXLSX = (
  rows: Row<Client>[],
  fileName = "dados_exportados",
  title = "Relatório de Clientes"
) => {
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

  const data = rows.map((row) => {
    return {
      code: row.original.code,
      nome: row.original.name,
      email: row.original.email || "Email não informado",
      telefone:
        (row.original.phone &&
          formatPhone(row.original.areaCode + row.original.phone)) ||
        "Telefone não informado",
      status: STATUS_MAP[row.original.status],
      dd: row.original.areaCode || "Não informado",
      cep:
        (row.original.zipCode && formatCEP(row.original.zipCode)) ||
        "Não informado",
      endereço: row.original.address,
      bairro: row.original.neighborhood,
      cidade: row.original.city,
      estado: row.original.state,
      "cpf/cnpj":
        (row.original.taxId &&
          (row.original.taxId?.length === 11
            ? formatCPF(row.original.taxId)
            : formatCNPJ(row.original.taxId))) ||
        "Não informado",
      "Tipo do registro":
        (row.original.taxId &&
          (row.original.taxId?.length === 11
            ? "Pessoa Física"
            : "Pessoa Jurídica")) ||
        "Não informado",
      "Data de nascimento":
        (row.original.openingDate && formatDate(row.original.openingDate)) ||
        "Não informado",
      "Data de abertura":
        (row.original.openingDate && formatDate(row.original.openingDate)) ||
        "Não informado",
      "Nome fantasia":
        (row.original.tradeName && row.original.tradeName) || "Não informado",
    };
  });

  try {
    const wb = utils.book_new();

    const ws = utils.aoa_to_sheet([]);

    utils.sheet_add_aoa(ws, [[title]], { origin: "A1", cellStyles: true });

    const headerRow = Object.values(headers);
    utils.sheet_add_aoa(ws, [headerRow], { origin: "A2", cellStyles: true });

    utils.sheet_add_json(ws, data, {
      origin: "A3",
      skipHeader: true,
      cellStyles: true,
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

    for (let i = 0; i < headerRow.length; i++) {
      const titleCell = utils.encode_cell({ r: 0, c: i });

      if (!ws[titleCell]) ws[titleCell] = { v: "" };

      ws[titleCell].s = {
        font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
        fill: {
          patternType: "solid",
          fgColor: { rgb: "4472C4" },
        },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    for (let i = 0; i < headerRow.length; i++) {
      const headerCell = utils.encode_cell({ r: 1, c: i });

      if (!ws[headerCell]) ws[headerCell] = { v: "" };

      ws[headerCell].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { patternType: "solid", fgColor: { rgb: "#5B9BD5" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    utils.book_append_sheet(wb, ws, "Dados");

    writeFile(wb, `${fileName}.xlsx`);
    return true;
  } catch (error) {
    console.error("Erro ao exportar XLSX:", error);
    return false;
  }
};
