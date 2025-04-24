import { FastifyInstance } from "fastify"
import { AuthControllers } from "./auth.controllers"

export class AuthRoutes {
  constructor(
    private readonly app: FastifyInstance,
    private readonly authControllers: AuthControllers,
  ) {}

  public build() {
    this.app.post(
      "/register",
      this.authControllers.register.bind(this.authControllers),
    )
    this.app.post(
      "/login",
      this.authControllers.login.bind(this.authControllers),
    )
    this.app.get(
      "/logout",
      this.authControllers.logout.bind(this.authControllers),
    )
    this.app.get(
      "/refresh",
      this.authControllers.refresh.bind(this.authControllers),
    )

    return this.app
  }
}
