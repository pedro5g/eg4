import { FastifyInstance } from "fastify"
import { StoreControllers } from "./store.controllers"
import { isAuthenticated } from "@/core/middlewares/is-authenticated"

export class StoreRoutes {
  constructor(
    private readonly app: FastifyInstance,
    private readonly storeControllers: StoreControllers,
  ) {}

  public build() {
    this.app.post(
      "/register",
      { preHandler: [isAuthenticated] },
      this.storeControllers.registerStore.bind(this.storeControllers),
    )
    this.app.delete(
      "/delete",
      { preHandler: [isAuthenticated] },
      this.storeControllers.deleteStore.bind(this.storeControllers),
    )
    this.app.get(
      "/get",
      { preHandler: [isAuthenticated] },
      this.storeControllers.getStoreByCode.bind(this.storeControllers),
    )
    this.app.get(
      "/list",
      { preHandler: [isAuthenticated] },
      this.storeControllers.listStores.bind(this.storeControllers),
    )

    return this.app
  }
}
