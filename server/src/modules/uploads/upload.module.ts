import { FastifyInstance } from "fastify"
import { UploadService } from "./upload.service"
import { UploadControllers } from "./upload.controllers"
import { UploadRoutes } from "./upload.routes"

export class UploadModule {
  static factory() {
    return new UploadService()
  }

  static build(app: FastifyInstance) {
    const uploadService = UploadModule.factory()
    const uploadControllers = new UploadControllers(uploadService)
    const uploadRoutes = new UploadRoutes(app, uploadControllers)

    return uploadRoutes.build()
  }
}
