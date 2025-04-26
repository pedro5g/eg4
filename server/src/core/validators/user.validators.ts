import { z } from "zod"

const nameSchema = z.string().trim().min(3).max(255)

// const fileSchema = z
//   .object({
//     filename: z.string().min(1, "Filename is required"),
//     mimetype: z.string().min(1, "Mimetype is required"),
//     data: z
//       .string()
//       .regex(/^data:image\/[a-z]+;base64,/, "Invalid Base64 format")
//       .transform((data) => {
//         const base64Data = data.replace(/^data:image\/[a-z]+;base64,/, "")
//         return Buffer.from(base64Data, "base64")
//       }),
//   })
//   .transform(({ data, filename, mimetype }) => {
//     return new File([data], filename, {
//       type: mimetype,
//     })
//   })
//   .nullish()
//   .default(null)

export const fileSchema = z.object({
  data: z.instanceof(Buffer),
  filename: z.string().min(1),
  mimetype: z.string().min(1),
})

export type FileSchemaType = {
  data?: Buffer
  filename?: string
  mimetype?: string
}
export const toFile = (buff?: FileSchemaType) => {
  const validation = fileSchema.safeParse(buff)

  if (!validation.success) {
    console.error(validation.error)
    return null
  }

  const { data, filename, mimetype } = validation.data

  return new File([data], filename, {
    type: mimetype,
  })
}

export const updateUserSchema = z.object({
  name: nameSchema,
})
