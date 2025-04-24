import { z } from "zod"
import { logger } from "../logger/index"

type StringValue = `${number}${"m" | "h" | "d"}`
const expiresAtSchema = z
  .string()
  .refine(
    (expiresAt) => {
      // Match number + unit (m = minutes, h = hours, d = days)
      return expiresAt.match(/^(\d+)([mhd])$/)
    },
    { message: 'Invalid format. Use "15m", "1h", or "2d".' },
  )
  .transform((value) => value as StringValue)

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
  API_PREFIX: z.string().trim(),
  WEB_ORIGEN: z.string().trim().url(),
  JWT_EXPIRES_IN: expiresAtSchema,
  JWT_PUBLIC_SECRET: z.string().trim(),
  REFRESH_EXPIRES_IN: expiresAtSchema,
  REFRESH_SECRET: z.string().trim(),
  COOKIE_SECRET: z
    .string()
    .trim()
    .length(32, { message: "key must be exactly 32 characters" }),
})

const envParse = envSchema.safeParse(process.env)

if (!envParse.success) {
  logger.error(
    "Invalid environments variables 🧨🧨🧨🧨",
    envParse.error.flatten(),
  )
  throw new Error("Invalid environments variables")
}

export const env = envParse.data
export type Env = z.infer<typeof envSchema>
