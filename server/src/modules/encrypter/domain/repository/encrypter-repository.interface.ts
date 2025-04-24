export interface IEncrypterRepository {
  toHash(planeText: string): Promise<string>
  compare(text: string, hash: string): Promise<boolean>
  encrypt(text: string, key: string): string
  decrypt(test: string, key: string): string
}
