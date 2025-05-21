import { PrismaClient } from "@prisma/client"
import { IClientFilesRepository } from "./domain/repository/client-files-repository.interface"
import {
  CreateClientFileDto,
  IClientFile,
} from "./domain/dtos/client-files.dtos"

export class ClientFilesRepository implements IClientFilesRepository {
  constructor(private readonly db: PrismaClient) {}

  async create({
    name,
    path,
    url,
    clientId,
  }: CreateClientFileDto): Promise<void> {
    await this.db.clientFile.create({
      data: {
        name,
        path,
        url,
        clientId,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.db.clientFile.delete({
      where: {
        id,
      },
    })
  }

  async findById(id: string): Promise<IClientFile | null> {
    const clientFile = await this.db.clientFile.findUnique({
      where: {
        id,
      },
    })

    return clientFile
  }

  async listFiles(clientId: string): Promise<IClientFile[]> {
    const clientFiles = await this.db.clientFile.findMany({
      where: {
        clientId,
      },
    })
    return clientFiles
  }
}
