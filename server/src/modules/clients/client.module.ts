import { FastifyInstance } from "fastify"
import { DatabaseModule } from "../db/database.module"
import { ClientRepository } from "./client.repository"
import { ClientServices } from "./client.services"
import { ClientControllers } from "./client.controllers"
import { CLientRoutes } from "./client.routes"

export class ClientModule {
  static build(app: FastifyInstance) {
    const clientRepository = DatabaseModule.makeRepository(ClientRepository)
    const clientServices = new ClientServices(clientRepository)
    const clientControllers = new ClientControllers(clientServices)
    const clientRoutes = new CLientRoutes(app, clientControllers)
    return clientRoutes.build()
  }
}
