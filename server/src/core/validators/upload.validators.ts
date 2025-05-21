import { z } from "zod"

export const downloadSchema = z.object({
  bucketName: z.string().trim(),
  fileName: z.string().trim(),
  download: z.coerce.boolean().optional().default(false),
})
