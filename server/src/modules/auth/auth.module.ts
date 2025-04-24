import { FastifyInstance } from "fastify"
import { DatabaseModule } from "../db/database.module"
import { AuthRepository } from "./auth.repository"
import { EncrypterModule } from "../encrypter/encrypter.module"
import { TokenModule } from "../token/token.module"
import { AuthServices } from "./auth.services"
import { AuthControllers } from "./auth.controllers"
import { AuthRoutes } from "./auth.routes"

export class AuthModule {
  static build(app: FastifyInstance) {
    const authRepository = DatabaseModule.makeRepository(AuthRepository)
    const encrypterService = EncrypterModule.factory()
    const tokenService = TokenModule.factory()

    const authServices = new AuthServices(
      authRepository,
      encrypterService,
      tokenService,
    )

    const authControllers = new AuthControllers(authServices)

    const authRoutes = new AuthRoutes(app, authControllers)
    return authRoutes.build()
  }
}
