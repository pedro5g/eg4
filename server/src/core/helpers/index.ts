import path from "node:path"
import {
  ALLOWED_TYPES,
  AllowedExtensionsTypes,
  BrowserViewableTypes,
} from "../constraints"

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

export function getMimeTypeFromExtension(fileExt: AllowedExtensionsTypes) {
  for (const [mimeType, extensions] of Object.entries(ALLOWED_TYPES)) {
    if (extensions.includes(fileExt.toLowerCase())) {
      return mimeType
    }
    return null
  }
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
