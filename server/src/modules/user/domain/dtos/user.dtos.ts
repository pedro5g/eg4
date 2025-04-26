import { User } from "@/modules/auth/domain/dtos/user.dtos"

export interface IUser extends User {}

export interface IUserInfo {
  name: string
  email: string
  avatarUrl: string | null
}

export interface UpdateAvatarProfileServiceDto {
  id: string
  avatarImage: File | null
}

export interface UpdateProfileServiceDto {
  id: string
  name: string
}
