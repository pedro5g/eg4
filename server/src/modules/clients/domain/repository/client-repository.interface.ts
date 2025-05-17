import {
  CursorPaginationDto,
  CursorPaginationReturnDto,
  IClient,
  RegisterClientDto,
  Status,
} from "../dtos/client.dtos"

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

export type SummaryData = {
  totalClients: number
  statusCounts: Record<Status, number>
  statesCounts: Record<string, number>
  newClientsThisMonth: number
  percentChange: number
}

export interface StreamChunk {
  type: "info" | "data" | "progress" | "complete" | "error"
  totalCount?: number
  clients?: IClient[]
  processed?: number
  total?: number
  message?: string
}

export const CHUNK_SIZE = 500

export interface IClientRepository {
  create(args: RegisterClientDto): Promise<void>
  update(client: IClient): Promise<void>
  findByCode(code: string): Promise<IClient | null>
  findById(id: string): Promise<IClient | null>
  findByEmail(email: string): Promise<IClient | null>
  findByTaxId(taxId: string): Promise<IClient | null>
  listClient({ page, query, status }: Filter): Promise<Meta>
  summary(): Promise<SummaryData>
  count(): Promise<number>
  findManyPaginated(take: number, cursor?: string): Promise<IClient[]>
  streamAllClients(chunkSize: number): AsyncGenerator<IClient[], void, unknown>
  cursorPagination({
    name,
    take,
    lastCursor,
  }: CursorPaginationDto): Promise<CursorPaginationReturnDto>
}
