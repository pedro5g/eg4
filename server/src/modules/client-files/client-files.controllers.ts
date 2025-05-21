import { FastifyReply, FastifyRequest } from "fastify"
import { ClientFilesServices } from "./client-files.services"
import { HTTP_STATUS } from "@/core/constraints"
import {
  createClientFileSchema,
  deleteClientFileSchema,
  listClientFilesSchema,
} from "@/core/validators/client-files.validators"

export class ClientFilesControllers {
  constructor(private readonly clientFilesServices: ClientFilesServices) {}
  async createClientFile(req: FastifyRequest, reply: FastifyReply) {
    const { clientId, bucket, file } = createClientFileSchema.parse(req.body)

    await this.clientFilesServices.createClientFile({
      clientId,
      bucket,
      file,
    })

    reply
      .status(HTTP_STATUS.OK)
      .send({ ok: true, message: "File uploaded successfully" })
  }

  async deleteFile(req: FastifyRequest, reply: FastifyReply) {
    const { id } = deleteClientFileSchema.parse(req.params)

    await this.clientFilesServices.deleteClientFile({ id })

    reply
      .status(HTTP_STATUS.OK)
      .send({ ok: true, message: "File deleted successfully" })
  }

  async listClientFiles(req: FastifyRequest, reply: FastifyReply) {
    const { clientId } = listClientFilesSchema.parse(req.params)

    const { clientFiles } = await this.clientFilesServices.listClientFiles({
      clientId,
    })

    reply.status(HTTP_STATUS.OK).send({ ok: true, clientFiles })
  }
}
