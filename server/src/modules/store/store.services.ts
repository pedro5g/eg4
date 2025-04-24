import { randomString } from "@/core/helpers"
import { CreateStoreServiceDto } from "./domain/dtos/store.dtos"
import { IStoreRepository } from "./domain/repository/store-repository.interface"
import { NotFoundException } from "@/core/exceptions"

export class StoreServices {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async registerNewStore({ name, address }: CreateStoreServiceDto) {
    await this.storeRepository.create({
      code: randomString(10),
      name,
      address,
    })
  }

  async deleteStore(code: string) {
    const store = await this.storeRepository.findByCode(code)

    if (!store) {
      throw new NotFoundException("Invalid code, store not found")
    }

    await this.deleteStore(code)
  }

  async getStoreByCode(code: string) {
    const store = await this.storeRepository.findByCode(code)

    if (!store) {
      throw new NotFoundException("Invalid code, store not found")
    }

    return { store }
  }

  async listAllStore() {
    const stores = await this.storeRepository.listStores()

    return { stores }
  }
}
