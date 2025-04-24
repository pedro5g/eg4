import { z } from "zod"

const nameSchema = z.string().trim().min(3).max(255)
const emailSchema = z.string().trim().email().max(255)
const idSchema = z.string().trim().uuid()
const fileSchema = z
  .object({
    filename: z.string().min(1, "Filename is required"),
    mimetype: z.string().min(1, "Mimetype is required"),
    data: z
      .string()
      .regex(/^data:image\/[a-z]+;base64,/, "Invalid Base64 format")
      .transform((data) => {
        const base64Data = data.replace(/^data:image\/[a-z]+;base64,/, "")
        return Buffer.from(base64Data, "base64")
      }),
  })
  .transform(({ data, filename, mimetype }) => {
    return new File([data], filename, {
      type: mimetype,
    })
  })
  .optional()

export const registerCustomerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  file: fileSchema,
})

export const updateCustomerSchema = z.object({
  name: nameSchema,
  file: fileSchema,
  avatarUrl: z.string().trim().nullish(),
})

export const updateCustomerParamsSchema = z.object({
  customerId: idSchema,
})

export const promoteSellerParamsSchema = z.object({
  sellerId: idSchema,
})

export const deleteParamsSchema = z.object({
  id: idSchema,
})
