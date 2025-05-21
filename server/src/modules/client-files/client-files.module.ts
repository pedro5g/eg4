import { FastifyInstance } from "fastify"
import { DatabaseModule } from "../db/database.module"
import { UploadService } from "../uploads/upload.service"
import { ClientRepository } from "../clients/client.repository"
import { ClientFilesRepository } from "./client-files.repository"
import { ClientFilesServices } from "./client-files.services"
import { ClientFilesControllers } from "./client-files.controllers"
import { ClientFilesRoutes } from "./client-files.route"

export class ClientFilesModule {
  static build(app: FastifyInstance) {
    const clientRepository = DatabaseModule.makeRepository(ClientRepository)
    const clientFilesRepository = DatabaseModule.makeRepository(
      ClientFilesRepository,
    )
    const uploadServices = new UploadService()

    const clientFilesServices = new ClientFilesServices(
      clientFilesRepository,
      clientRepository,
      uploadServices,
    )
    const clientFilesControllers = new ClientFilesControllers(
      clientFilesServices,
    )
    const clientFilesRoutes = new ClientFilesRoutes(app, clientFilesControllers)

    return clientFilesRoutes.build()
  }
}
