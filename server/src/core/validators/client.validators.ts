import { z } from "zod"
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

export const mobilePhoneSchema = z
  .string()
  .trim()
  .min(9)
  .max(9)
  .regex(/[0-9]$/g)
export const landlinesSchema = z
  .string()
  .trim()
  .min(8)
  .max(8)
  .regex(/[0-9]$/g)

const baseStringSchema = z.string().trim().min(3).max(255)

const addressSchema = baseStringSchema
const stateSchema = z
  .string()
  .trim()
  .min(2)
  .max(2)
  .transform((st) => st.toUpperCase())
const cityCodeSchema = baseStringSchema.nullable()
const nameSchema = baseStringSchema
const tradeNameSchema = baseStringSchema
const neighborhoodSchema = baseStringSchema.nullable()
const zipCodeSchema = z
  .string()
  .trim()
  .min(8)
  .max(8)
  .regex(/[0-9]$/g)
const citySchema = baseStringSchema
const areaCodeSchema = z
  .string()
  .trim()
  .min(2)
  .max(2)
  .regex(/[0-9]$/g)
  .nullable()
export const phoneSchema = z
  .union([mobilePhoneSchema, landlinesSchema])
  .nullable()
const typeSchema = baseStringSchema
const emailSchema = z.string().trim().email().nullable()
const countrySchema = baseStringSchema.nullable()
const taxIdSchema = z.union([cnpjSchema, cpfSchema]).nullable()
const openingDateSchema = z.string().nullable()
const homepageSchema = baseStringSchema.nullable()
const statusSchema = z.enum(["ACTIVE", "INACTIVE", "BLOCKED", "PENDING"])

const storeIdSchema = z.number().int().positive()

const codeSchema = z.string().trim().min(10).max(10)

export const registerClientSchema = z.object({
  address: addressSchema,
  state: stateSchema,
  cityCode: cityCodeSchema,
  name: nameSchema,
  tradeName: tradeNameSchema,
  neighborhood: neighborhoodSchema,
  zipCode: zipCodeSchema,
  city: citySchema,
  areaCode: areaCodeSchema,
  phone: phoneSchema,
  type: typeSchema,

  email: emailSchema,
  country: countrySchema,
  taxId: taxIdSchema,
  openingDate: openingDateSchema,
  homepage: homepageSchema,
  status: statusSchema.default("ACTIVE"),
  storeId: storeIdSchema,
})

export const updateClientSchema = z.object({
  code: codeSchema,
  address: addressSchema,
  state: stateSchema,
  cityCode: cityCodeSchema,
  name: nameSchema,
  tradeName: tradeNameSchema,
  neighborhood: neighborhoodSchema,
  zipCode: zipCodeSchema,
  city: citySchema,
  areaCode: areaCodeSchema,
  phone: phoneSchema,
  type: typeSchema,
  email: emailSchema,
  country: countrySchema,
  taxId: taxIdSchema,
  openingDate: openingDateSchema,
  homepage: homepageSchema,
  status: statusSchema,
  storeId: storeIdSchema,
})

export const getClientSchema = z.object({
  code: codeSchema,
})

export const listClientsSchema = z.object({
  page: z.coerce
    .number()
    .transform((value) => {
      if (value <= 0) return 1
      return value
    })
    .optional()
    .default(1),
  take: z.coerce
    .number()
    .transform((value) => {
      if (value <= 0) return 10
      return value
    })
    .optional()
    .default(10),
  q: z.string().trim().optional(),
  s: stateSchema.optional(),
})
