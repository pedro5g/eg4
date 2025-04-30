import { FastifyInstance } from "fastify"
import { DatabaseModule } from "../db/database.module"
import { ClientRepository } from "./client.repository"
import { ClientServices } from "./client.services"
import { ClientControllers } from "./client.controllers"
import { CLientRoutes } from "./client.routes"
import { StoreRepository } from "../store/store.repository"

export class ClientModule {
  static build(app: FastifyInstance) {
    const clientRepository = DatabaseModule.makeRepository(ClientRepository)
    const storeRepository = DatabaseModule.makeRepository(StoreRepository)
    const clientServices = new ClientServices(clientRepository, storeRepository)
    const clientControllers = new ClientControllers(clientServices)
    const clientRoutes = new CLientRoutes(app, clientControllers)
    return clientRoutes.build()
  }
}
