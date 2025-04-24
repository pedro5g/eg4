import { z } from "zod"

const nameSchema = z.string().trim().min(3).max(255)
const emailSchema = z.string().trim().email().max(255)
const passwordSchema = z.string().trim().min(6).max(255)

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((args) => args.password === args.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwords don't matches",
  })

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})
