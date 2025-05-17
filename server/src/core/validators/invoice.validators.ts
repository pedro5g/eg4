import { z } from "zod"

export const numberSchema = z
  .string()
  .trim()
  .length(13)
  .regex(/^\d+$/, "invalid number code")

export const clientIdSchema = z.string().trim().cuid()

export const registerInvoiceSchema = z.object({
  clientId: clientIdSchema,
  number: numberSchema,
  product: z.string().trim().min(1).max(255),
  issueDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  amount: z.coerce.number(),
})

export const updateInvoiceStatusSchema = z.object({
  number: numberSchema,
})

export const getInvoiceSchema = z.object({
  number: numberSchema,
})

export const listClintInvoiceSchema = z.object({
  clientId: clientIdSchema,
})
