import path from "node:path"
import {
  ALLOWED_TYPES,
  AllowedExtensionsTypes,
  BrowserViewableTypes,
} from "../constraints"
import { IClientFile } from "@/modules/client-files/domain/dtos/client-files.dtos"
import { env } from "node:process"

export function sanitizeFilename(fileName: string) {
  const name = path.basename(fileName)
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "_")
    .replace(/[_+]/g, "_")
}

export function isAllowedMineType(
  type: string,
): type is keyof typeof ALLOWED_TYPES {
  return type in ALLOWED_TYPES
}

export function getMimeTypeFromExtension(fileExt: string) {
  for (const [mimeType, extensions] of Object.entries(ALLOWED_TYPES)) {
    if (extensions.includes(fileExt.toLowerCase())) {
      return mimeType
    }
  }
  return null
}

export function canShowInBrowser(fileExt: string) {
  return BrowserViewableTypes.includes(fileExt.toLowerCase())
}

export function bufferToFile(
  buff: Buffer<ArrayBufferLike>,
  fileName: string,
  mimetype: string,
) {
  const file = new File([new Blob([buff], { type: mimetype })], fileName, {
    type: mimetype,
  })

  return file
}

/**
 * Pseudo-random string generator
 * http://stackoverflow.com/a/27872144/383904
 * Default: return a random alpha-numeric string
 *
 * @param {Integer} len Desired length Default 10
 * @param {String} an Optional (alphanumeric), "a" (alpha), "n" (numeric)
 * @return {String}
 */
export function randomString(len: number = 10, an?: "a" | "n") {
  let str = "",
    i = 0
  const min = an && an.toString() === "a" ? 10 : 0,
    max = an && an.toString() === "n" ? 10 : 62
  for (; i++ < len; ) {
    let r = (Math.random() * (max - min) + min) << 0
    str += String.fromCharCode((r += r > 9 ? (r < 36 ? 55 : 61) : 48))
  }
  return str
}

export interface FileNode {
  type: "file"
  name: string
  id: string
  clientId: string
  url: string
  uploadedAt: string | Date
  path: string
}
export interface DirectoryNode {
  type: "directory"
  name: string
  path: string
  itemCount: number
  children: FileNode | DirectoryNode
}

export type TreeNode = FileNode | DirectoryNode

export function groupByPath(files: IClientFile[]) {
  const result: Record<string, TreeNode> = {}

  for (const file of files) {
    if (!file.path) continue

    const segments = file.path.split("/")

    let current: Record<string, TreeNode> | TreeNode = result

    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i]

      if (!("type" in current) && !current[segment]) {
        current[segment] = {
          type: "directory",
          name: segment,
          children: {} as FileNode | DirectoryNode,
          itemCount: 0,
          path: segments.slice(0, i + 1).join("/"),
        }
      }

      if (!("type" in current) && current[segment].type === "directory") {
        current[segment].itemCount++
        current = current[segment].children
      }
    }

    const fileName = segments[segments.length - 1]

    if (fileName && !("type" in current)) {
      current[fileName] = {
        type: "file",
        name: file.name,
        id: file.id,
        clientId: file.clientId,
        url: `http://localhost:8080/${env.API_PREFIX}/upload/files/${file.url}`,
        uploadedAt: file.uploadedAt,
        path: file.path,
      }
    }
  }

  function convertToArray(
    obj: Record<string, TreeNode> | TreeNode,
  ): TreeNode[] {
    const nodes = Object.values(obj)

    const directories = nodes.filter((node) => node.type === "directory")
    const files = nodes.filter((node) => node.type === "file")

    directories.sort((a, b) => a.name.localeCompare(b.name))
    files.sort((a, b) => a.name.localeCompare(b.name))

    const processedDirectories = directories.map(
      (dir) =>
        ({
          ...dir,
          children: convertToArray(dir.children),
        }) as DirectoryNode,
    )

    return [...processedDirectories, ...files]
  }

  return convertToArray(result)
}
