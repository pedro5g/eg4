export type VerifyResponse<T = object> =
  | {
      payload: T
      error?: undefined
    }
  | {
      error: unknown
      payload?: undefined
    }

export type Opts<T = object> = {
  secret: string
} & T

export interface ITokenRepository {
  signToken<P extends object>(payload: P, opts: Opts): string
  verifyToken<P>(token: string, opts: Opts): VerifyResponse<P>
}
