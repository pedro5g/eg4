export interface UploadDTO {
  file: File
  bucket: string
}

export interface DownloadDTO {
  fileName: string
  bucketName: string
}
export interface DeleteDTO {
  fileName: string
  bucketName: string
}
