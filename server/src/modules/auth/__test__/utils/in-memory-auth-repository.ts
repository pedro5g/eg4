import { RegisterUserDTO, User, UserInfos } from "../../domain/dtos/user.dtos"
import { IAuthRepository } from "../../domain/repositories/auth-repository.interface"
import { randomUUID } from "node:crypto"

export class InMemoryAuthRepository implements IAuthRepository {
  public users: User[] = []

  async create({ name, email, password }: RegisterUserDTO): Promise<void> {
    this.users.push({
      id: randomUUID(),
      name,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "SELLER",
      avatarUrl: null,
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async findById(id: string): Promise<UserInfos | null> {
    return this.users.find((user) => user.id === id) || null
  }
}
