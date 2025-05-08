export const STATES = [
  { title: "Acre", value: "AC" },
  { title: "Alagoas", value: "AL" },
  { title: "Amapá", value: "AP" },
  { title: "Amazonas", value: "AM" },
  { title: "Bahia", value: "BA" },
  { title: "Ceará", value: "CE" },
  { title: "Distrito Federal", value: "DF" },
  { title: "Espírito Santo", value: "ES" },
  { title: "Goiás", value: "GO" },
  { title: "Maranhão", value: "MA" },
  { title: "Mato Grosso", value: "MT" },
  { title: "Mato Grosso do Sul", value: "MS" },
  { title: "Minas Gerais", value: "MG" },
  { title: "Pará", value: "PA" },
  { title: "Paraíba", value: "PB" },
  { title: "Paraná", value: "PR" },
  { title: "Pernambuco", value: "PE" },
  { title: "Piauí", value: "PI" },
  { title: "Rio de Janeiro", value: "RJ" },
  { title: "Rio Grande do Norte", value: "RN" },
  { title: "Rio Grande do Sul", value: "RS" },
  { title: "Rondônia", value: "RO" },
  { title: "Roraima", value: "RR" },
  { title: "Santa Catarina", value: "SC" },
  { title: "São Paulo", value: "SP" },
  { title: "Sergipe", value: "SE" },
  { title: "Tocantins", value: "TO" },
];

export const STATUS_OPTIONS = [
  { title: "Ativo", value: "ACTIVE" },
  { title: "Inativo", value: "INACTIVE" },
  { title: "Bloqueado", value: "BLOCKED" },
  { title: "Pendente", value: "PENDING" },
];

export const TYPES = [
  { title: "Pessoa Física", value: "F" },
  { title: "Pessoa Jurídica", value: "J" },
];

export const STATUS_MAP: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  BLOCKED: "Bloqueado",
  PENDING: "Pendente",
};

export const STYLE_STATUS_MAP: Record<string, string> = {
  ACTIVE: "text-green-800 border-green-800 bg-green-500/60",
  INACTIVE: "text-blue-800 border-blue-800 bg-blue-500/60",
  BLOCKED: "text-red-800 border-red-800 bg-red-500/60",
  PENDING: "text-gray-800 border-gray-800 bg-gray-500/60",
};
