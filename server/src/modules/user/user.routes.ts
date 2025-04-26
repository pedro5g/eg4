import { FastifyInstance } from "fastify"
import { UserControllers } from "./user.controllers"
import { isAuthenticated } from "@/core/middlewares/is-authenticated"

export class UserRoutes {
  constructor(
    private readonly app: FastifyInstance,
    private readonly userControllers: UserControllers,
  ) {}

  public build() {
    this.app.get(
      "/profile",
      { preHandler: [isAuthenticated] },
      this.userControllers.profile.bind(this.userControllers),
    )
    this.app.patch(
      "/update/avatar",
      { preHandler: [isAuthenticated] },
      this.userControllers.updateAvatarProfile.bind(this.userControllers),
    )
    this.app.patch(
      "/update/profile",
      { preHandler: [isAuthenticated] },
      this.userControllers.updateProfile.bind(this.userControllers),
    )

    return this.app
  }
}
