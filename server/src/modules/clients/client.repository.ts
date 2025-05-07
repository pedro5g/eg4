import { PrismaClient, Status } from "@prisma/client"
import {
  Filter,
  IClientRepository,
  Meta,
} from "./domain/repository/client-repository.interface"
import { IClient, RegisterClientDto } from "./domain/dtos/client.dtos"

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
}
