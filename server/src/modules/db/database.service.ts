import { PrismaClient } from "@prisma/client"
import { IDatabaseRepository } from "./interfaces/database.interface"
import { env } from "@/core/env"

export class DatabaseService
  extends PrismaClient
  implements IDatabaseRepository
{
  constructor() {
    super({
      log: env.NODE_ENV === "dev" ? ["query", "warn"] : ["warn"],
    })
  }
  async onInit(): Promise<void> {
    this.$connect()
  }

  async onStop(): Promise<void> {
    this.$disconnect()
  }
}
