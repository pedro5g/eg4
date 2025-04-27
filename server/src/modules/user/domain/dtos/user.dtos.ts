import { User } from "@/modules/auth/domain/dtos/user.dtos"
export type Roles = "ADMIN" | "SELLER"
export interface IUser extends User {}

export interface IUserInfo {
  name: string
  email: string
  role: Roles
  phone: string | null
  address: string | null
  avatarUrl: string | null
}

export interface UpdateAvatarProfileServiceDto {
  id: string
  avatarImage: File | null
}

export interface UpdateProfileServiceDto {
  id: string
  name: string
  phone: string | null
  address: string | null
}
