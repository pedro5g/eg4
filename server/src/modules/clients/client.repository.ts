import { PrismaClient } from "@prisma/client"
import {
  Filter,
  IClientRepository,
  Meta,
  SummaryData,
} from "./domain/repository/client-repository.interface"
import { IClient, RegisterClientDto, Status } from "./domain/dtos/client.dtos"

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

  async findByEmail(email: string): Promise<IClient | null> {
    const client = await this.db.client.findUnique({
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

    const statusCounts = Object.fromEntries(
      resultCountByStatus.map((data) => [data.status, data._count.status]),
    ) as Record<Status, number>

    const statesCounts = Object.fromEntries(
      topStates.map((state) => [state.state, state._count.state]),
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

  async findManyPaginated(skip: number, take: number): Promise<IClient[]> {
    return await this.db.client.findMany({
      skip,
      take,
    })
  }

  async *streamAllClients(
    chunkSize: number,
  ): AsyncGenerator<IClient[], void, unknown> {
    let skip = 0
    let hasMoreData = true

    while (hasMoreData) {
      const clients = await this.findManyPaginated(skip, chunkSize)

      if (clients.length === 0) {
        hasMoreData = false
      } else {
        yield clients
        skip += chunkSize
      }
    }
  }
}
