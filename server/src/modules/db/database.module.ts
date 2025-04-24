import { DatabaseService } from "./database.service"

export class DatabaseModule {
  static factory() {
    return new DatabaseService()
  }
  static makeRepository<T extends new (db: DatabaseService) => InstanceType<T>>(
    Repository: T,
  ): InstanceType<T> {
    return new Repository(this.factory())
  }
}
