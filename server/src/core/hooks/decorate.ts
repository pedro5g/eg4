import { FastifyInstance } from "fastify"
import { env } from "../env"
import { UnauthorizedException } from "../exceptions"
import { TokenModule } from "@/modules/token/token.module"
import { AccessTokenPayload, accessTokenSignOptions } from "../jwt"
import { logger } from "../logger"
import { COOKIES, REFRESH_PATH } from "../constraints"

export async function decorate(app: FastifyInstance) {
  app.addHook("onRequest", async (request, reply) => {
    reply.setAuthCookies = ({ accessToken, refreshToken }) => {
      reply
        .setCookie(COOKIES.ACCESS_TOKEN, accessToken, {
          httpOnly: true,
          secure: env.NODE_ENV === "prod" ? true : false,
          sameSite: env.NODE_ENV === "prod" ? "strict" : "lax",
          maxAge: 60 * 60 * 1, //1h
          path: "/",
          signed: true,
        })
        .setCookie(COOKIES.REFRESH_TOKEN, refreshToken, {
          httpOnly: true,
          secure: env.NODE_ENV === "prod" ? true : false,
          sameSite: env.NODE_ENV === "prod" ? "strict" : "lax",
          maxAge: 60 * 60 * 24, //1d
          path: REFRESH_PATH,
          signed: true,
        })

      return reply
    }

    reply.signOut = () => {
      reply
        .clearCookie(COOKIES.ACCESS_TOKEN)
        .clearCookie(COOKIES.REFRESH_TOKEN, {
          path: REFRESH_PATH,
        })
      return reply
    }

    request.getCookie = (cookieName) => {
      const cookie = request.cookies[cookieName]

      if (!cookie) return ""

      const value = request.unsignCookie(cookie).value

      if (!value) {
        throw new UnauthorizedException("Invalid cookie")
      }

      return value
    }

    // request.getUserId = () => {
    //   const accessToken = request.getCookie("accessToken")

    //   if (!accessToken) {
    //     throw new UnauthorizedException()
    //   }
    //   const verifyToken = TokenModule.getService("verifyToken")

    //   const { payload } = verifyToken<AccessTokenPayload>(
    //     accessToken,
    //     accessTokenSignOptions,
    //   )

    //   if (!payload) {
    //     throw new UnauthorizedException()
    //   }

    //   return payload.id
    // }
  })

  app.addHook("onRequest", async (request) => {
    const { ip, method, url, headers } = request
    const { restaurant_id, user_id } = headers as Record<string, string>

    const id = new Date().getTime()

    let idsMsg = ""
    if (user_id) idsMsg += ` _ u=${user_id}`
    if (restaurant_id) idsMsg += ` _ a=${restaurant_id}`

    if (env.NODE_ENV === "dev") {
      const msg = `[${ip}] {${method}} ${id} - Receiving ${url}`
      logger.info(`${msg}${idsMsg}`)
    }

    request.headers["request-start-time"] = `${new Date().getTime()}`
  })

  app.addHook("onResponse", async (request, reply) => {
    const started = Number(request.headers["request-start-time"] || 0)
    const took = new Date().getTime() - started

    const { ip, method, url, headers } = request
    const { account_id, user_id } = headers as Record<string, string>

    let idsMsg = ""
    if (user_id) idsMsg += ` _ u=${user_id}`
    if (account_id) idsMsg += ` _ a=${account_id}`
    if (env.NODE_ENV !== "test") {
      logger.info(
        `\x1b[32m{req}\x1b[0m [${ip}] ${method}` +
          `${url} : http=${reply.statusCode} ${took}ms`,
      )
    }
  })
}
