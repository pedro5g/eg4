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

export const formatCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 9);
};

export const formatDate = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3")
    .replace(/\/(\d{4})(\d)/, "$1/$2/$3")
    .substring(0, 10);
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

export const formatCurrency = (amount: string) => {
  amount = amount.replace(".", "").replace(",", "").replace(/\D/g, "");
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(parseFloat(amount) / 100);
};

export function randomString(len: number = 10, an?: "a" | "n") {
  let str = "",
    i = 0;
  const min = an && an.toString() === "a" ? 10 : 0,
    max = an && an.toString() === "n" ? 10 : 62;
  for (; i++ < len; ) {
    let r = (Math.random() * (max - min) + min) << 0;
    str += String.fromCharCode((r += r > 9 ? (r < 36 ? 55 : 61) : 48));
  }
  return str;
}

export const getDueDays = (dueDate: Date | string) => {
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
};

export function isJavaVersion() {
  return import.meta.env.VITE_IS_JAVA_VERSION === "true";
}
