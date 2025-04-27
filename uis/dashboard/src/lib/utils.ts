import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (fullName: string) => {
  return (
    fullName
      .trim()
      .split(" ")
      .map((c) => c[0].toUpperCase())
      .slice(0, 2)
      .join("") || "NA"
  );
};

export const capitalize = (text: string) => {
  return text
    .trim()
    .split(" ")
    .map((part) => {
      const [start, ...rest] = part;
      return start[0].toUpperCase() + rest.join("").toLowerCase();
    })
    .join(" ");
};

export const formatCNPJ = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
};

export const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2")
    .substring(0, 14);
};

export const formatPhone = (value: string) => {
  value = value.replace(/\D/g, "");

  if (value.length <= 10) {
    // (XX) XXXX-XXXX
    return value
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 14);
  } else {
    //  (XX) XXXXX-XXXX
    return value
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  }
};

export const formatCpfCnpj = (value: string) => {
  value = value.replace(/\D/g, "");

  if (value.length <= 11) {
    return formatCPF(value);
  } else {
    return formatCNPJ(value);
  }
};
