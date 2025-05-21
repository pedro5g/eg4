export type IClientFile = {
  id: string
  clientId: string
  name: string
  path: string
  url: string
  uploadedAt: string | Date
}

export interface CreateClientFileDto {
  clientId: string
  name: string
  path: string
  url: string
}

export interface CreateClientFileServiceDto {
  clientId: string
  bucket: string
  file: File
}

export interface DeleteClientFileServiceDto {
  id: string
}

export interface ListClientFilesDto {
  clientId: string
}
