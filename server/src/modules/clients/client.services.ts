import { BadRequestException } from "@/core/exceptions"
import { RegisterClientServiceDto } from "./domain/dtos/client.dtos"
import { IClientRepository } from "./domain/repository/client-repository.interface"
import { randomString } from "@/core/helpers"

export class ClientServices {
  constructor(private readonly clientRepository: IClientRepository) {}

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
    storeId,
    taxId,
    tradeName,
    type,
    zipCode,
  }: RegisterClientServiceDto) {
    if (email) {
      const clientAlreadyExist = await this.clientRepository.findByEmail(email)

      if (clientAlreadyExist) {
        throw new BadRequestException("Client with this email already exists")
      }
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
      storeId,
      taxId,
      tradeName,
      type,
      zipCode,
    })
  }
}
