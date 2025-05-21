import { FastifyReply, FastifyRequest } from "fastify"
import { UploadService } from "./upload.service"
import { downloadSchema } from "@/core/validators/upload.validators"
import { HTTP_STATUS } from "@/core/constraints"

export class UploadControllers {
  constructor(private readonly uploadServices: UploadService) {}

  async download(request: FastifyRequest, reply: FastifyReply) {
    const fullPath = decodeURIComponent((request.params as any)["*"])
    const match = fullPath.match(/^(.*)\/([^\/]+)$/)

    const { bucketName, fileName, download } = downloadSchema.parse({
      bucketName: match?.[1] || "",
      fileName: match?.[2] || "",
      ...(request.query as object),
    })

    const { file, headers } = await this.uploadServices.download({
      bucketName,
      fileName,
      download,
    })

    reply
      .status(HTTP_STATUS.OK)
      .headers(headers)
      .type(headers["Content-Type"])
      .send(file)
  }
}
