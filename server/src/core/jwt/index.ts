import { SignOptions } from "jsonwebtoken"
import { env } from "../env"

export type AccessTokenPayload = {
  id: string
  role: "ADMIN" | "SELLER" | "CLIENT"
}

export type RefreshTokenPayload = {
  id: string
}

type SignOptsAndSecret = SignOptions & {
  secret: string
}

export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: env.JWT_EXPIRES_IN,
  secret: env.JWT_PUBLIC_SECRET,
  audience: ["user"],
}

export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: env.REFRESH_EXPIRES_IN,
  secret: env.REFRESH_SECRET,
  audience: ["user"],
}
