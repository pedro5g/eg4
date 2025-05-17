import { PrismaClient } from "@prisma/client"
import {
  Filter,
  IClientRepository,
  Meta,
  SummaryData,
} from "./domain/repository/client-repository.interface"
import {
  CursorPaginationDto,
  CursorPaginationReturnDto,
  IClient,
  RegisterClientDto,
  Status,
} from "./domain/dtos/client.dtos"

export class ClientRepository implements IClientRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(args: RegisterClientDto): Promise<void> {
    await this.db.client.create({
      data: {
        ...args,
      },
    })
  }

  async update(client: IClient): Promise<void> {
    const { id, code, registrationDate, authorId, ...rest } = client
    await this.db.client.update({
      where: { code },
      data: {
        ...rest,
      },
    })
  }

  async findById(id: string): Promise<IClient | null> {
    const client = await this.db.client.findUnique({
      where: {
        id,
      },
    })
    return client
  }

  async findByEmail(email: string): Promise<IClient | null> {
    const client = await this.db.client.findFirst({
      where: {
        email,
      },
    })
    return client
  }
  async findByTaxId(taxId: string): Promise<IClient | null> {
    const client = await this.db.client.findUnique({
      where: {
        taxId,
      },
    })
    return client
  }

  async findByCode(code: string): Promise<IClient | null> {
    const client = await this.db.client.findUnique({
      where: {
        code,
      },
    })
    return client
  }

  async listClient({ page, take, query, status }: Filter): Promise<Meta> {
    const prismaQuery = {
      where: {
        ...(query && {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { code: { contains: query } },
            { city: { contains: query } },
            { taxId: { contains: query } },
          ],
        }),
        ...(status && { status: { in: [...status] as Status[] } }),
      },
    }

    const [clients, total] = await Promise.all([
      this.db.client.findMany({
        ...prismaQuery,
        skip: (page - 1) * take,
        take,
        orderBy: { registrationDate: "desc" },
      }),
      this.db.client.count(prismaQuery),
    ])

    return {
      items: clients,
      meta: { page, take, total, pageCount: Math.ceil(total / take) },
    }
  }

  async cursorPagination({
    name,
    take = 10,
    lastCursor,
  }: CursorPaginationDto): Promise<CursorPaginationReturnDto> {
    const result = await this.db.client.findMany({
      where: { ...(name && { name: { contains: name } }) },
      take: take,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor as string,
        },
      }),
      orderBy: {
        name: "asc",
      },
    })
    console.log(name)
    if (result.length == 0) {
      return {
        data: [],
        meta: {
          lastCursor: null,
          hasNextPage: false,
        },
      }
    }

    const cursor = result[result.length - 1].id

    const nextPage = await this.db.client.findMany({
      where: { ...(name && { name }) },
      take: take,
      skip: 1,
      cursor: {
        id: cursor,
      },
    })

    const data = {
      data: result,
      meta: {
        lastCursor: cursor,
        hasNextPage: nextPage.length > 0,
      },
    }

    return data
  }

  async summary(): Promise<SummaryData> {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const [totalClients, newClientsThisMonth, resultCountByStatus, topStates] =
      await Promise.all([
        this.db.client.count(),
        this.db.client.count({
          where: {
            registrationDate: {
              gte: startOfMonth,
              lt: startOfNextMonth,
            },
          },
        }),
        this.db.client.groupBy({
          by: ["status"],
          _count: {
            status: true,
          },
        }),
        this.db.client.groupBy({
          by: "state",
          _count: {
            state: true,
          },
          orderBy: {
            _count: {
              state: "desc",
            },
          },
          take: 6,
        }),
      ])

    const statusCounts = (
      resultCountByStatus.length
        ? Object.fromEntries(
            resultCountByStatus.map((data) => [
              data.status,
              data._count.status,
            ]),
          )
        : {
            ACTIVE: 0,
            INACTIVE: 0,
            PENDING: 0,
            BLOCKED: 0,
          }
    ) as Record<Status, number>

    const statesCounts = Object.fromEntries(
      topStates.map((state) => [state.state, state._count.state]) || {},
    )

    const percentChange =
      totalClients === 0 ? 0 : (newClientsThisMonth / totalClients) * 100
    return {
      totalClients,
      newClientsThisMonth,
      statusCounts,
      percentChange,
      statesCounts,
    }
  }

  async count(): Promise<number> {
    return await this.db.client.count()
  }

  async findManyPaginated(take: number, cursor?: string): Promise<IClient[]> {
    return await this.db.client.findMany({
      take,
      ...(cursor
        ? {
            skip: 1,
            cursor: {
              id: cursor,
            },
          }
        : {}),
      orderBy: {
        id: "asc",
      },
    })
  }

  async *streamAllClients(
    chunkSize: number,
  ): AsyncGenerator<IClient[], void, unknown> {
    let cursor: string | undefined = undefined

    while (true) {
      const clients = await this.findManyPaginated(chunkSize, cursor)

      if (clients.length === 0) break

      yield clients
      cursor = clients[clients.length - 1].id
    }
  }
}
