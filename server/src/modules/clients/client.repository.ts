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

    const [totalClients, newClientsThisMonth, result] = await Promise.all([
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
    ])

    const statuses: Status[] = ["ACTIVE", "INACTIVE", "BLOCKED", "PENDING"]

    const statusCounts: Record<Status, number> = statuses.reduce(
      (acc, status) => {
        const match = result.find((r) => r.status === status)
        acc[status] = match ? match._count.status : 0
        return acc
      },
      {} as Record<Status, number>,
    )

    const percentChange =
      totalClients === 0 ? 0 : (newClientsThisMonth / totalClients) * 100
    return {
      totalClients,
      newClientsThisMonth,
      statusCounts,
      percentChange,
    }
  }
}
