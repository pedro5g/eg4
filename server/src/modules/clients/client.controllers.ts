import { FastifyReply, FastifyRequest } from "fastify"
import { ClientServices } from "./client.services"
import {
  getClientSchema,
  listClientsSchema,
  registerClientSchema,
  updateClientSchema,
} from "@/core/validators/client.validators"
import { HTTP_STATUS } from "@/core/constraints"
import { Status } from "./domain/dtos/client.dtos"

export class ClientControllers {
  constructor(private readonly clientServices: ClientServices) {}

  async registerClient(req: FastifyRequest, reply: FastifyReply) {
    const authorId = req.user.id
    const clientData = registerClientSchema.parse(req.body)
    await this.clientServices.registerNewClient({ ...clientData, authorId })
    reply
      .status(HTTP_STATUS.CREATED)
      .send({ ok: true, message: "Client registered successfully" })
  }

  async updateClient(req: FastifyRequest, reply: FastifyReply) {
    const updateClientData = updateClientSchema.parse(req.body)
    await this.clientServices.updateClient(updateClientData)
    reply
      .status(HTTP_STATUS.OK)
      .send({ ok: true, message: "Client updated successfully" })
  }

  async getClient(req: FastifyRequest, reply: FastifyReply) {
    const { code } = getClientSchema.parse(req.params)
    const { client } = await this.clientServices.getClientByCode(code)
    reply.status(HTTP_STATUS.OK).send({ ok: true, client })
  }

  async listClient(req: FastifyRequest, reply: FastifyReply) {
    const { page, take, q, s } = listClientsSchema.parse(req.query)

    const { items, meta } = await this.clientServices.listClient({
      page,
      take,
      query: q,
      status: s as Status[],
    })
    reply.status(HTTP_STATUS.OK).send({ ok: true, data: { items, meta } })
  }
}
