import { env } from "../env"

export const ErrorCode = {
  AUTH_EMAIL_ALREADY_EXISTS: "AUTH_EMAIL_ALREADY_EXISTS",
  AUTH_INVALID_TOKEN: "AUTH_INVALID_TOKEN",
  AUTH_USER_NOT_FOUND: "AUTH_USER_NOT_FOUND",
  AUTH_NOT_FOUND: "AUTH_NOT_FOUND",
  AUTH_TOO_MANY_ATTEMPTS: "AUTH_TOO_MANY_ATTEMPTS",
  AUTH_UNAUTHORIZED_ACCESS: "AUTH_UNAUTHORIZED_ACCESS",
  AUTH_TOKEN_NOT_FOUND: "AUTH_TOKEN_NOT_FOUND",

  // Access Control Errors
  ACCESS_FORBIDDEN: "ACCESS_FORBIDDEN",
  ACCESS_UNAUTHORIZED: "ACCESS_UNAUTHORIZED",
  BAD_REQUEST: "BAD_REQUEST",
  EMAIL_ALREADY_REGISTERED: "EMAIL_ALREADY_REGISTERED",
  TAXID_ALREADY_REGISTERED: "TAXID_ALREADY_REGISTERED",

  // Validation and Resource Errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",

  // System Errors
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  VERIFICATION_ERROR: "VERIFICATION_ERROR",
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  // Client error responses
  REDIRECT: 301,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  // Server error responses
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

export const ExitCode = {
  FAILURE: 1,
  SUCCESS: 0,
} as const

export const REFRESH_PATH = `/${env.API_PREFIX}/auth/refresh` as const

export const COOKIES = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const

export const ALLOWED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "image/svg+xml": [".svg"],

  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "text/plain": [".txt"],
  "text/csv": [".csv"],

  "application/zip": [".zip"],
  "application/x-rar-compressed": [".rar"],
  "application/x-zip-compressed": [".zip"],
  "application/octet-stream": [".zip"],

  "audio/mpeg": [".mp3"],
  "audio/wav": [".wav"],

  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
}

export const BrowserViewableTypes = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".pdf",
  ".txt",
  ".mp3",
  ".wav",
  ".mp4",
  ".webm",
]

export const MAX_FILE_SIZE = 100 * 1024 * 1024

export const UPLOAD_DIR = "uploads"

export type ExitCodeType = keyof typeof ExitCode
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]
export type ErrorCodeType = keyof typeof ErrorCode
export type AllowedTypes = keyof typeof ALLOWED_TYPES
export type AllowedExtensionsTypes =
  (typeof ALLOWED_TYPES)[AllowedTypes][number]
export type AllowedExtensions = (typeof ALLOWED_TYPES)[AllowedTypes]
