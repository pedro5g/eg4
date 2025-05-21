import { z } from "zod"

export const createClientFileSchema = z.object({
  clientId: z.string().trim().cuid(),
  bucket: z.string().trim().min(2).max(100),
  file: z.instanceof(File),
})

export const deleteClientFileSchema = z.object({
  id: z.string().trim().cuid(),
})

export const listClientFilesSchema = z.object({
  clientId: z.string().trim().cuid(),
})
