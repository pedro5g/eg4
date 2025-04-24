import { FastifyRequest, FastifyReply } from "fastify"
import { AuthServices } from "./auth.services"
import { loginSchema, registerSchema } from "@/core/validators/auth.validators"
import { HTTP_STATUS } from "@/core/constraints"

export class AuthControllers {
  constructor(private readonly authServices: AuthServices) {}

  async register(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = registerSchema.parse(request.body)
    await this.authServices.registerUser({ name, email, password })

    reply
      .status(HTTP_STATUS.CREATED)
      .send({ ok: true, message: "User registered successfully" })
  }
  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = loginSchema.parse(request.body)
    const { user, accessToken, refreshToken } =
      await this.authServices.loginService({ email, password })

    reply
      .setAuthCookies({ accessToken, refreshToken })
      .status(HTTP_STATUS.OK)
      .send({ ok: true, message: "Login successfully", user })
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    reply.signOut().status(HTTP_STATUS.OK).send({
      ok: true,
      message: "Logout successfully",
    })
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const refresh = request.getCookie("refreshToken")

    const { accessToken, refreshToken } =
      await this.authServices.revalidateToken(refresh)

    reply
      .setAuthCookies({ accessToken, refreshToken })
      .status(HTTP_STATUS.OK)
      .send({ ok: true, message: "Revalidated successfully" })
  }
}
