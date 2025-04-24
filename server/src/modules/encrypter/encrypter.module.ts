import { EncrypterService } from "./encrypter.service"

export class EncrypterModule {
  static factory() {
    return new EncrypterService()
  }

  static getService<K extends keyof EncrypterService>(key: K) {
    return this.factory()[key]
  }
}
