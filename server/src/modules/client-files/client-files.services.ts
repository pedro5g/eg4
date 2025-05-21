import { NotFoundException } from "@/core/exceptions"
import { IClientRepository } from "../clients/domain/repository/client-repository.interface"
import { UploadService } from "../uploads/upload.service"
import {
  CreateClientFileServiceDto,
  DeleteClientFileServiceDto,
  ListClientFilesDto,
} from "./domain/dtos/client-files.dtos"
import { IClientFilesRepository } from "./domain/repository/client-files-repository.interface"
import { groupByPath } from "@/core/helpers"

export class ClientFilesServices {
  constructor(
    private readonly clientFilesRepository: IClientFilesRepository,
    private readonly clientRepository: IClientRepository,
    private readonly uploadServices: UploadService,
  ) {}

  async createClientFile({
    clientId,
    file,
    bucket,
  }: CreateClientFileServiceDto) {
    const clientExist = await this.clientRepository.findById(clientId)

    if (!clientExist) {
      throw new NotFoundException("Invalid client id, client not found")
    }

    const { fileName, bucketName } = await this.uploadServices.upload({
      file,
      bucket,
    })

    await this.clientFilesRepository.create({
      clientId,
      name: file.name,
      path: `${bucket}/${fileName}`,
      url: `${bucketName}/${fileName}`,
    })
  }

  async deleteClientFile({ id }: DeleteClientFileServiceDto) {
    const fileExist = await this.clientFilesRepository.findById(id)
    if (!fileExist) {
      throw new NotFoundException("Invalid file id, client not found")
    }

    const [bucketName, fileName] = fileExist.url
      .split(/^(.*)\/([^\\/]+)$/)
      .slice(1)
    await this.uploadServices.deleteFile({ bucketName, fileName })
    await this.clientFilesRepository.delete(id)
  }

  async listClientFiles({ clientId }: ListClientFilesDto) {
    const clientExist = await this.clientRepository.findById(clientId)

    if (!clientExist) {
      throw new NotFoundException("Invalid client id, client not found")
    }

    const clientFiles = await this.clientFilesRepository.listFiles(clientId)

    return { clientFiles: groupByPath(clientFiles) }
  }
}
