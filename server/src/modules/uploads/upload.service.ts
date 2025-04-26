import { ALLOWED_TYPES, MAX_FILE_SIZE, UPLOAD_DIR } from "@/core/constraints"
import { BadRequestException, NotFoundException } from "@/core/exceptions"
import {
  canShowInBrowser,
  getMimeTypeFromExtension,
  isAllowedMineType,
  sanitizeFilename,
} from "@/core/helpers"
import { DeleteDTO, DownloadDTO, UploadDTO } from "./domain/dto/upload.dto"
import { dirname } from "dirname"
import path from "path"
import fs from "node:fs/promises"
import { logger } from "@/core/logger"

export class UploadService {
  async upload({ file, bucket }: UploadDTO) {
    if (!isAllowedMineType(file.type)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types: ${Object.keys(
          ALLOWED_TYPES,
        ).join(", ")}`,
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      )
    }

    const originalExtension = path.extname(file.name).toLowerCase()

    const allowedExtensions = ALLOWED_TYPES[file.type]

    if (!allowedExtensions.includes(originalExtension)) {
      throw new BadRequestException(
        `Invalid file extension. Expected: ${allowedExtensions.join(", ")}`,
      )
    }

    const timestamp = Date.now()
    const bucketName = `bucket-${bucket}`
    const safeFileName = `${timestamp}-${sanitizeFilename(file.name)}`

    const bucketPath = path.join(dirname, UPLOAD_DIR, bucketName)
    const filePath = path.join(bucketPath, safeFileName)

    await fs.mkdir(bucketPath, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await fs.writeFile(filePath, buffer)
    const stats = await fs.stat(filePath)

    if (stats.size !== file.size) {
      throw new BadRequestException("File upload failed")
    }

    return {
      message: "File uploaded successfully",
      bucketName,
      fileName: safeFileName,
    }
  }

  async download({ fileName, bucketName }: DownloadDTO) {
    const fileExt = path.extname(fileName).toLowerCase()
    const contentType = getMimeTypeFromExtension(fileExt)

    if (!contentType) {
      throw new BadRequestException("Invalid file type")
    }

    const bucketPath = path.join(dirname, UPLOAD_DIR, bucketName)
    const filePath = path.join(bucketPath, fileName)

    try {
      await fs.access(filePath)
    } catch (error) {
      throw new NotFoundException("File not found")
    }

    const stats = await fs.stat(filePath)

    if (stats.size > MAX_FILE_SIZE) {
      throw new BadRequestException("File too large")
    }

    const file = await fs.readFile(filePath)
    const disposition = canShowInBrowser(fileExt) ? "inline" : "attachment"

    return {
      file,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `${disposition}; filename="${encodeURIComponent(
          fileName,
        )}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Security-Policy": "default-src 'self'",
        "X-Content-Type-Options": "nosniff",
        "Content-Length": stats.size.toString(),
        "Accept-Ranges": "bytes",
      },
    }
  }

  async deleteFile({ fileName, bucketName }: DeleteDTO) {
    try {
      const bucketPath = path.join(dirname, UPLOAD_DIR, bucketName)
      const filePath = path.join(bucketPath, fileName)
      await fs.unlink(filePath)
      return { message: "File deleted successfully" }
    } catch (error) {
      logger.error("Error on delete file", error)
      return { message: "Error on delete file" }
    }
  }
}
