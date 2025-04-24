import { PrismaClient } from "@prisma/client"
import { RegisterUserDTO, User, UserInfos } from "./domain/dtos/user.dtos"
import { IAuthRepository } from "./domain/repositories/auth-repository.interface"

export class AuthRepository implements IAuthRepository {
  constructor(private readonly db: PrismaClient) {}

  async create({ name, email, password }: RegisterUserDTO): Promise<void> {
    await this.db.user.create({
      data: {
        name,
        email,
        password,
      },
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async findById(id: string): Promise<UserInfos | null> {
    const user = await this.db.user.findUnique({
      where: {
        id,
      },
      omit: { password: true },
    })

    return user
  }
}
