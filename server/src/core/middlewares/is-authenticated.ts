import { FastifyReply, FastifyRequest } from "fastify"
import { UnauthorizedException } from "../exceptions"
import { TokenModule } from "@/modules/token/token.module"
import { AccessTokenPayload, accessTokenSignOptions } from "../jwt"
import { ErrorCode, HTTP_STATUS } from "../constraints"

export async function isAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const accessToken = request.getCookie("accessToken")

  if (!accessToken) {
    return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
      ok: false,
      message: "Unauthorized Access",
      errorCode: ErrorCode.AUTH_TOKEN_NOT_FOUND,
    })
  }
  const verifyToken = TokenModule.getService("verifyToken")

  const { payload } = verifyToken<AccessTokenPayload>(
    accessToken,
    accessTokenSignOptions,
  )

  if (!payload) {
    return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
      ok: false,
      message: "Unauthorized Access",
      errorCode: ErrorCode.AUTH_INVALID_TOKEN,
    })
  }

  request.user = {
    id: payload.id,
    role: payload.role,
  }
}
