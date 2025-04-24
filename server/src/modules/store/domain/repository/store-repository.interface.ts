import {
  CreateStoreDto,
  IStore,
  IStoreWithoutClients,
} from "../dtos/store.dtos"

export interface IStoreRepository {
  create(args: CreateStoreDto): Promise<void>
  findByCode(code: string): Promise<IStore | null>
  findById(id: number): Promise<IStore | null>
  listStores(): Promise<IStoreWithoutClients[]>
  delete(code: string): Promise<void>
}
