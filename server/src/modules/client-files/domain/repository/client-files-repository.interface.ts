import { CreateClientFileDto, IClientFile } from "../dtos/client-files.dtos"

export interface IClientFilesRepository {
  create(args: CreateClientFileDto): Promise<void>
  delete(id: string): Promise<void>
  findById(id: string): Promise<IClientFile | null>
  listFiles(clientId: string): Promise<IClientFile[]>
}
