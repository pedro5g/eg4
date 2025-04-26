import { IUser, IUserInfo } from "../dtos/user.dtos"

export interface IUserRepository {
  getUserById(id: string): Promise<IUser | null>
  getProfileById(id: string): Promise<IUserInfo | null>
  updateProfile(user: IUser): Promise<void>
}
