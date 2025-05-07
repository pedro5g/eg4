import { BadRequestException, NotFoundException } from "@/core/exceptions"
import {
  RegisterClientServiceDto,
  UpdateClientServiceDto,
} from "./domain/dtos/client.dtos"
import {
  Filter,
  IClientRepository,
} from "./domain/repository/client-repository.interface"
import { randomString } from "@/core/helpers"
import { IStoreRepository } from "../store/domain/repository/store-repository.interface"
import { IStore } from "../store/domain/dtos/store.dtos"
import { ErrorCode } from "@/core/constraints"

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
    if (email) {
      const clientAlreadyExist = await this.clientRepository.findByEmail(email)

      if (clientAlreadyExist) {
        throw new BadRequestException(
          "Client with this email already exists",
          ErrorCode.EMAIL_ALREADY_REGISTERED,
        )
      }
    }

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
      code: randomString(10),
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

    if (
      (!client.email && email) ||
      (client.email && email && client.email !== email)
    ) {
      const emailAlreadyRegistered =
        await this.clientRepository.findByEmail(email)
      if (emailAlreadyRegistered) {
        throw new BadRequestException(
          "Invalid email, email already used by another client",
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
}
