import { PrismaClient } from "@prisma/client"
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
    const { id, code, registrationDate, ...rest } = client
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

  async findByCode(code: string): Promise<IClient | null> {
    const client = await this.db.client.findUnique({
      where: {
        code,
      },
    })
    return client
  }

  async listStores({ page, take, query, status }: Filter): Promise<Meta> {
    const prismaQuery = {
      skip: (page - 1) * take,
      take,
      where: {
        ...(query && {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { code: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { taxId: { contains: query, mode: "insensitive" } },
          ],
        }),
        ...(status && { status }),
      },
    }

    const [clients, total] = await Promise.all([
      this.db.client.findMany({
        ...prismaQuery,
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
