import { FastifyInstance } from "fastify"
import { UploadControllers } from "./upload.controllers"

export class UploadRoutes {
  constructor(
    private readonly app: FastifyInstance,
    private readonly uploadController: UploadControllers,
  ) {}

  public build() {
    this.app.get(
      "/files/*",
      this.uploadController.download.bind(this.uploadController),
    )

    return this.app
  }
}

// http://localhost:8080/api/v1/upload/files/test-bbd33de7-eb51-4918-8041-5ce718610119/1742787255247-image-test-1.jpg
