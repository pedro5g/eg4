export type Roles = "ADMIN" | "SELLER" | "CLIENT"

export type User = {
  id: string
  name: string
  email: string
  password: string
  avatarUrl: string | null
  role: Roles
  createdAt: Date | string
  updatedAt: Date | string | null
}

export type UserInfos = {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  role: Roles
  createdAt: Date | string
  updatedAt: Date | string | null
}

export interface RegisterUserDTO {
  name: string
  email: string
  password: string
  avatarUrl?: string
}

export interface UserAuthDTO {
  email: string
  password: string
}

export interface UpdateUserDTO {
  id: string
  name: string
  avatarUrl?: string | null
}
