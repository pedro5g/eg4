import { FastifyInstance } from "fastify"
import { DatabaseModule } from "../db/database.module"
import { StoreRepository } from "./store.repository"
import { StoreServices } from "./store.services"
import { StoreControllers } from "./store.controllers"
import { StoreRoutes } from "./store.routes"

export class StoreModule {
  static build(app: FastifyInstance) {
    const storeRepository = DatabaseModule.makeRepository(StoreRepository)

    const storeServices = new StoreServices(storeRepository)

    const storeControllers = new StoreControllers(storeServices)

    const storeRoutes = new StoreRoutes(app, storeControllers)
    return storeRoutes.build()
  }
}
