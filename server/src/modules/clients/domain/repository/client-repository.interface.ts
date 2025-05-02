import { IClient, RegisterClientDto, Status } from "../dtos/client.dtos"

export type Filter = {
  page: number
  take: number
  query?: string
  status?: Status[]
}

export type Meta = {
  items: IClient[]
  meta: {
    total: number
    page: number
    take: number
    pageCount: number
  }
}

export interface IClientRepository {
  create(args: RegisterClientDto): Promise<void>
  update(client: IClient): Promise<void>
  findByCode(code: string): Promise<IClient | null>
  findByEmail(email: string): Promise<IClient | null>
  listClient({ page, query, status }: Filter): Promise<Meta>
}
