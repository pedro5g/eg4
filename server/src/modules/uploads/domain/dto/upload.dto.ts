export interface UploadDTO {
  file: File
  bucket: string
}

export interface DownloadDTO {
  fileName: string
  bucketName: string
  download: boolean
}
export interface DeleteDTO {
  fileName: string
  bucketName: string
}
