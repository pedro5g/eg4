import { z } from "zod"
const stringOrNullSchema = z
  .string()
  .trim()
  .nullable()
  .transform((value) => {
    if (value === "") return null
    return value
  })

const cpfSchema = stringOrNullSchema.pipe(
  z
    .string()
    .trim()
    .min(11)
    .max(11)
    .regex(/^\d+$/, "CPF should only have numbers")
    .nullable(),
)

const cnpjSchema = stringOrNullSchema.pipe(
  z
    .string()
    .trim()
    .min(14)
    .max(14)
    .regex(/^\d+$/, "CNPJ should only have numbers")
    .nullable(),
)

export const mobilePhoneSchema = stringOrNullSchema.pipe(
  z.string().min(9).max(9).regex(/^\d+$/).nullable(),
)

export const landlinesSchema = stringOrNullSchema.pipe(
  z.string().min(8).max(8).regex(/^\d+$/).nullable(),
)

const baseStringSchema = z.string().trim().min(3).max(255)

const addressSchema = z.string().trim().min(3).max(255)

const stateSchema = z
  .string()
  .trim()
  .min(2)
  .max(2)
  .transform((st) => st.toUpperCase())

const cityCodeSchema = stringOrNullSchema.pipe(
  z.string().trim().min(2).max(255).nullable(),
)
const nameSchema = z.string().trim().min(1).max(255)
const tradeNameSchema = stringOrNullSchema.pipe(
  z.string().trim().min(2).max(255).nullable(),
)
const neighborhoodSchema = stringOrNullSchema.pipe(
  z.string().trim().min(2).max(255).nullable(),
)
const zipCodeSchema = stringOrNullSchema.pipe(
  z.string().min(8).max(8).regex(/^\d+$/).nullable(),
)
const citySchema = baseStringSchema
const areaCodeSchema = stringOrNullSchema.pipe(
  z.string().min(2).max(2).regex(/^\d+$/).nullable(),
)

export const phoneSchema = z.union([mobilePhoneSchema, landlinesSchema])

const typeSchema = z.string().trim().min(1).max(255).nullable()

const emailSchema = stringOrNullSchema.pipe(z.string().email().nullable())
const countrySchema = stringOrNullSchema

const taxIdSchema = z.union([cnpjSchema, cpfSchema])
const openingDateSchema = stringOrNullSchema
const homepageSchema = stringOrNullSchema

const statusSchema = z.enum(["ACTIVE", "INACTIVE", "BLOCKED", "PENDING"])

const storeCodeSchema = z.string().trim().min(10).max(10)

const codeSchema = z.string().trim()

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
  storeCode: storeCodeSchema,
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
})

export const getClientSchema = z.object({
  code: codeSchema,
})

export const deleteClientSchema = z.object({
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
  s: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return undefined
      return value.split(",")
    })
    .pipe(
      z.array(z.enum(["ACTIVE", "INACTIVE", "BLOCKED", "PENDING"])).optional(),
    ),
})

export const cursorPaginationSchema = z.object({
  take: z.coerce.number().optional().default(10),
  lastCursor: z.string().trim().optional(),
  name: z.string().trim().optional(),
})
