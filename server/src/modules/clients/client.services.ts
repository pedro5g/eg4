import { BadRequestException, NotFoundException } from "@/core/exceptions"
import {
  CursorPaginationDto,
  RegisterClientServiceDto,
  UpdateClientServiceDto,
} from "./domain/dtos/client.dtos"
import {
  CHUNK_SIZE,
  Filter,
  IClientRepository,
  StreamChunk,
} from "./domain/repository/client-repository.interface"
import { randomString } from "@/core/helpers"
import { IStoreRepository } from "../store/domain/repository/store-repository.interface"
import { IStore } from "../store/domain/dtos/store.dtos"
import { ErrorCode } from "@/core/constraints"
import { logger } from "@/core/logger"

export class ClientServices {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly storeRepository: IStoreRepository,
  ) {}

  async registerNewClient({
    name,
    email,
    address,
    areaCode,
    city,
    cityCode,
    country,
    homepage,
    neighborhood,
    openingDate,
    phone,
    state,
    status,
    storeCode,
    taxId,
    tradeName,
    type,
    zipCode,
    authorId,
  }: RegisterClientServiceDto) {
    if (taxId) {
      const clientAlreadyExist = await this.clientRepository.findByTaxId(taxId)

      if (clientAlreadyExist) {
        throw new BadRequestException(
          "Client with this taxId already exists",
          ErrorCode.TAXID_ALREADY_REGISTERED,
        )
      }
    }

    let store: IStore | null = null

    if (storeCode) {
      store = await this.storeRepository.findByCode(storeCode)
    }

    await this.clientRepository.create({
      code: randomString(6),
      name,
      email,
      address,
      areaCode,
      city,
      cityCode,
      country,
      homepage,
      neighborhood,
      openingDate,
      phone,
      state,
      status,
      storeId: store?.id || null,
      taxId,
      tradeName,
      type,
      zipCode,
      authorId,
    })
  }

  async updateClient({
    code,
    name,
    email,
    address,
    areaCode,
    city,
    cityCode,
    country,
    homepage,
    neighborhood,
    openingDate,
    phone,
    state,
    status,
    taxId,
    tradeName,
    type,
    zipCode,
  }: UpdateClientServiceDto) {
    const client = await this.clientRepository.findByCode(code)

    if (!client) {
      throw new NotFoundException("Invalid code, clint not found")
    }

    if (client.taxId && taxId && client.taxId !== taxId) {
      throw new BadRequestException("TaxId cannot be modified")
    }

    if (!client.taxId && taxId) {
      const clientAlreadyExist = await this.clientRepository.findByTaxId(taxId)

      if (clientAlreadyExist) {
        throw new BadRequestException(
          "Client with this taxId already exists",
          ErrorCode.TAXID_ALREADY_REGISTERED,
        )
      }
    }

    await this.clientRepository.update({
      ...client,
      name,
      email,
      address,
      areaCode,
      city,
      cityCode,
      country,
      homepage,
      neighborhood,
      openingDate,
      phone,
      state,
      status,
      taxId,
      tradeName,
      type,
      zipCode,
    })
  }

  async deleteCliente(code: string) {
    const client = await this.clientRepository.findByCode(code)

    if (!client) {
      throw new NotFoundException("Invalid code, client not found")
    }

    await this.clientRepository.delete(code)
  }

  async getClientByCode(code: string) {
    const client = await this.clientRepository.findByCode(code)
    if (!client) {
      throw new NotFoundException("Invalid code, client not found")
    }

    return { client }
  }

  async listClient({ page, take, query, status }: Filter) {
    const { items, meta } = await this.clientRepository.listClient({
      page,
      take,
      query,
      status,
    })

    return { items, meta }
  }

  async getSummary() {
    const summary = await this.clientRepository.summary()

    return { summary }
  }

  async *createExportPipeline(): AsyncGenerator<StreamChunk, void, unknown> {
    try {
      const totalClients = await this.clientRepository.count()

      yield { type: "info", totalCount: totalClients }

      let processedCount = 0

      for await (const clientsChunk of this.clientRepository.streamAllClients(
        CHUNK_SIZE,
      )) {
        yield { type: "data", clients: clientsChunk }

        processedCount += clientsChunk.length
        yield {
          type: "progress",
          processed: processedCount,
          total: totalClients,
        }

        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      yield { type: "complete" }
    } catch (error) {
      logger.error("Error during customer export:", error)
      yield { type: "error", message: "Error to export clients" }
    }
  }

  async cursorPagination({ name, take, lastCursor }: CursorPaginationDto) {
    const result = await this.clientRepository.cursorPagination({
      name,
      take,
      lastCursor,
    })

    return result
  }
}
