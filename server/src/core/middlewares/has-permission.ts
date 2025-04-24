import { FastifyReply, FastifyRequest } from "fastify"
import { ErrorCode, HTTP_STATUS } from "../constraints"

export function hasPermission(role: "ADMIN" | "SELLER") {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.user.role !== role) {
      return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
        ok: false,
        message: "Unauthorized Access",
        errorCode: ErrorCode.ACCESS_FORBIDDEN,
      })
    }
  }
}
