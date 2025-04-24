import { z } from "zod"

// const cpfMask = (value: string) => {
//   return value
//     .replace(/\D/g, "")
//     .replace(/(\d{3})(\d)/, "$1.$2")
//     .replace(/(\d{3})(\d)/, "$1.$2")
//     .replace(/(\d{3})(\d{1,2})/, "$1-$2")
//     .replace(/(-\d{2})\d+?$/, "$1")
// }

const cpfSchema = z
  .string()
  .trim()
  .min(11)
  .max(11)
  .regex(/[0-9]$/g, "CPF should only have numbers")

const cnpjSchema = z
  .string()
  .trim()
  .min(14)
  .max(14)
  .regex(/[0-9]$/g, "CNPJ should only have numbers")
