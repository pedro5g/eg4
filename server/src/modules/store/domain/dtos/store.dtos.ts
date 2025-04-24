import { IClient } from "@/modules/clients/domain/dtos/client.dtos"

export interface IStore {
  id: number
  code: string
  name: string
  address: string | null
  clients: IClient[]
}

export interface IStoreWithoutClients {
  id: number
  code: string
  name: string
  address: string | null
}

export interface CreateStoreDto {
  code: string
  name: string
  address: string | null
}

export interface CreateStoreServiceDto {
  name: string
  address: string | null
}
