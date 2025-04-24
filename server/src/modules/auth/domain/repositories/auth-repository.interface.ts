import { RegisterUserDTO, User, UserInfos } from "../dtos/user.dtos"

export interface IAuthRepository {
  create(args: RegisterUserDTO): Promise<void>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<UserInfos | null>
}
