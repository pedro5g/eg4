import { FastifyReply, FastifyRequest } from "fastify"
import { StoreServices } from "./store.services"
import {
  getStoreByCodeSchema,
  registerStoreSchema,
} from "@/core/validators/store.validators"
import { HTTP_STATUS } from "@/core/constraints"

export class StoreControllers {
  constructor(private readonly storeServices: StoreServices) {}

  async registerStore(req: FastifyRequest, reply: FastifyReply) {
    const { name, address } = registerStoreSchema.parse(req.body)
    await this.storeServices.registerNewStore({ name, address })
    reply
      .status(HTTP_STATUS.CREATED)
      .send({ ok: true, message: "Store created successfully " })
  }

  async deleteStore(req: FastifyRequest, reply: FastifyReply) {
    const { code } = getStoreByCodeSchema.parse(req.query)
    await this.storeServices.deleteStore(code)
    reply
      .status(HTTP_STATUS.OK)
      .send({ ok: true, message: "Store deleted successfully" })
  }

  async getStoreByCode(req: FastifyRequest, reply: FastifyReply) {
    const { code } = getStoreByCodeSchema.parse(req.query)
    const { store } = await this.storeServices.getStoreByCode(code)
    reply.status(HTTP_STATUS.OK).send({ ok: true, store })
  }

  async listStores(_req: FastifyRequest, reply: FastifyReply) {
    const { stores } = await this.storeServices.listAllStore()
    reply.status(HTTP_STATUS.OK).send({ ok: true, stores })
  }
}
