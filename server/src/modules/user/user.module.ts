import { FastifyInstance } from "fastify"
import { DatabaseModule } from "../db/database.module"
import { UserRepository } from "./user.repository"
import { UserServices } from "./user.services"
import { UploadService } from "../uploads/upload.service"
import { UserControllers } from "./user.controllers"
import { UserRoutes } from "./user.routes"

export class UserModule {
  static build(app: FastifyInstance) {
    const userRepository = DatabaseModule.makeRepository(UserRepository)
    const uploadService = new UploadService()

    const userServices = new UserServices(userRepository, uploadService)

    const userControllers = new UserControllers(userServices)

    const userRoutes = new UserRoutes(app, userControllers)
    return userRoutes.build()
  }
}
