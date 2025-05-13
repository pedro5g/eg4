import { FastifyInstance } from "fastify"
import { ClientControllers } from "./client.controllers"
import { isAuthenticated } from "@/core/middlewares/is-authenticated"

export class CLientRoutes {
  constructor(
    private readonly app: FastifyInstance,
    private readonly clientControllers: ClientControllers,
  ) {}

  public build() {
    this.app.post(
      "/register",
      { preHandler: [isAuthenticated] },
      this.clientControllers.registerClient.bind(this.clientControllers),
    )
    this.app.patch(
      "/update",
      { preHandler: [isAuthenticated] },
      this.clientControllers.updateClient.bind(this.clientControllers),
    )
    this.app.get(
      "/profile/:code",
      { preHandler: [isAuthenticated] },
      this.clientControllers.getClient.bind(this.clientControllers),
    )
    this.app.get(
      "/list-clients",
      { preHandler: [isAuthenticated] },
      this.clientControllers.listClient.bind(this.clientControllers),
    )

    this.app.get(
      "/summary",
      { preHandler: [isAuthenticated] },
      this.clientControllers.getSummary.bind(this.clientControllers),
    )
    this.app.get(
      "/export-all-clients",
      { preHandler: [isAuthenticated] },
      this.clientControllers.exportClientsStream.bind(this.clientControllers),
    )

    return this.app
  }
}
