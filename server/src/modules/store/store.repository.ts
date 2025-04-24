import { PrismaClient } from "@prisma/client"
import { IStoreRepository } from "./domain/repository/store-repository.interface"
import {
  CreateStoreDto,
  IStore,
  IStoreWithoutClients,
} from "./domain/dtos/store.dtos"

export class StoreRepository implements IStoreRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(args: CreateStoreDto): Promise<void> {
    await this.db.store.create({
      data: {
        code: args.code,
        name: args.name,
        address: args.address,
      },
    })
  }

  async delete(code: string): Promise<void> {
    await this.db.store.delete({
      where: { code },
    })
  }

  async findById(id: number): Promise<IStore | null> {
    const store = await this.db.store.findUnique({
      where: { id },
      include: {
        clients: true,
      },
    })

    return store
  }

  async findByCode(code: string): Promise<IStore | null> {
    const store = await this.db.store.findUnique({
      where: { code },
      include: {
        clients: true,
      },
    })

    return store
  }

  async listStores(): Promise<IStoreWithoutClients[]> {
    const stores = await this.db.store.findMany()
    return stores
  }
}
