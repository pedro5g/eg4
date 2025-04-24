import { z } from "zod"

export const registerStoreSchema = z.object({
  name: z.string().trim().min(2),
  address: z.string().trim().min(1).nullable(),
})

export const getStoreByCodeSchema = z.object({
  code: z.string().trim().min(10).max(10),
})
