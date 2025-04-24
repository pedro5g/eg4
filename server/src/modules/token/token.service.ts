import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken"
import {
  ITokenRepository,
  Opts,
  VerifyResponse,
} from "./domain/repository/token-repository.interface"

export class TokenService implements ITokenRepository {
  signToken<P extends object>(payload: P, opts: Opts<SignOptions>): string {
    const { secret, ...rest } = opts
    return jwt.sign(payload, secret, { ...rest })
  }

  verifyToken<P>(token: string, opts: Opts<VerifyOptions>): VerifyResponse<P> {
    try {
      const { secret, ...rest } = opts
      const payload = jwt.verify(token, secret, {
        ...rest,
      }) as P
      return { payload }
    } catch (e: unknown) {
      const message =
        e && typeof e === "object" && "message" in e ? e?.message : e
      return {
        error: message,
      }
    }
  }
}
