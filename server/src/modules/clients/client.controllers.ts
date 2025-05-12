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

  async getSummary(_req: FastifyRequest, reply: FastifyReply) {
    const { summary } = await this.clientServices.getSummary()
    reply.status(HTTP_STATUS.OK).send({ ok: true, data: { summary } })
  }

  async exportClientStream(
    _request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      reply.raw.writeHead(200, {
        "Content-Type": "application/json",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      })

      const exportPipeline = this.clientServices.createExportPipeline()

      for await (const chunk of exportPipeline) {
        reply.raw.write(JSON.stringify(chunk) + "\n")
      }

      reply.raw.end()
    } catch (error) {
      console.error("Erro ao processar stream de exportação:", error)

      if (!reply.sent) {
        reply.status(500).send({ error: "Erro ao exportar clientes" })
      } else {
        try {
          reply.raw.write(
            JSON.stringify({
              type: "error",
              message: "Erro ao exportar clientes",
            }) + "\n",
          )
          reply.raw.end()
        } catch (e) {
          reply.raw.end()
        }
      }
    }
  }
}
