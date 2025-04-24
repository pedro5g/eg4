import { FastifyReply, FastifyRequest } from "fastify"
import { UploadService } from "./upload.service"
import { downloadSchema } from "@/core/validators/upload.validators"
import { HTTP_STATUS } from "@/core/constraints"

export class UploadControllers {
  constructor(private readonly uploadServices: UploadService) {}

  async download(request: FastifyRequest, reply: FastifyReply) {
    const { bucketName, fileName } = downloadSchema.parse(request.params)

    const { file, headers } = await this.uploadServices.download({
      bucketName,
      fileName,
    })

    reply
      .status(HTTP_STATUS.OK)
      .headers(headers)
      .type(headers["Content-Type"])
      .send(file)
  }
}
