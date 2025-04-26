import { PrismaClient } from "@prisma/client"
import { IUserRepository } from "./domain/repository/user-repository.interface"
import { IUser, IUserInfo } from "./domain/dtos/user.dtos"

export class UserRepository implements IUserRepository {
  constructor(private readonly db: PrismaClient) {}

  async getUserById(id: string): Promise<IUser | null> {
    const user = await this.db.user.findUnique({
      where: { id },
    })

    return user
  }

  async getProfileById(id: string): Promise<IUserInfo | null> {
    const profile = await this.db.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        avatarUrl: true,
      },
    })

    return profile
  }

  async updateProfile(user: IUser): Promise<void> {
    await this.db.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    })
  }
}
