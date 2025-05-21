import { FastifyInstance } from "fastify"
import { isAuthenticated } from "@/core/middlewares/is-authenticated"
import { ClientFilesControllers } from "./client-files.controllers"
import { multipartResolver } from "@/core/middlewares/mutilpart-resolver"

export class ClientFilesRoutes {
  constructor(
    private readonly app: FastifyInstance,
    private readonly clientFilesControllers: ClientFilesControllers,
  ) {}

  public build() {
    this.app.post(
      "/create",
      { preHandler: [isAuthenticated, multipartResolver] },
      this.clientFilesControllers.createClientFile.bind(
        this.clientFilesControllers,
      ),
    )
    this.app.delete(
      "/:id",
      {
        preHandler: [isAuthenticated],
      },
      this.clientFilesControllers.deleteFile.bind(this.clientFilesControllers),
    )
    this.app.get(
      "/:clientId/list",
      { preHandler: [isAuthenticated] },
      this.clientFilesControllers.listClientFiles.bind(
        this.clientFilesControllers,
      ),
    )

    return this.app
  }
}
