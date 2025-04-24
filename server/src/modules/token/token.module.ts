import { TokenService } from "./token.service"

export class TokenModule {
  static factory() {
    return new TokenService()
  }

  static getService<K extends keyof TokenService>(key: K) {
    return this.factory()[key]
  }
}
