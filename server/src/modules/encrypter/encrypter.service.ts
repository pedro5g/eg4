import { promisify } from "node:util"
import {
  scrypt,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from "node:crypto"
import { IEncrypterRepository } from "./domain/repository/encrypter-repository.interface"

const asyncScrypt = promisify(scrypt)

export class EncrypterService implements IEncrypterRepository {
  private LEN = 30

  async toHash(planeText: string): Promise<string> {
    const SALT = randomBytes(this.LEN).toString("hex")
    const endHash = (await asyncScrypt(planeText, SALT, this.LEN)) as Buffer

    return `${SALT}.${endHash.toString("hex")}`
  }

  async compare(text: string, hash: string): Promise<boolean> {
    const [SALT, endHash] = hash.split(".")

    const hut = (await asyncScrypt(text, SALT, this.LEN)) as Buffer

    return endHash === hut.toString("hex")
  }

  encrypt(text: string, key: string): string {
    if (key.length !== 32) {
      throw new Error("key must be exactly 32 characters")
    }

    const textBuff = Buffer.from(text, "utf-8")
    const keyBuff = Buffer.from(key, "utf-8")

    const iv = randomBytes(12)
    const cipher = createCipheriv("aes-256-gcm", keyBuff, iv)
    const encrypted = Buffer.concat([
      Buffer.from("eg4"),
      iv,
      cipher.update(textBuff),
      cipher.final(),
      cipher.getAuthTag(),
    ])

    return encrypted.toString("base64")
  }

  decrypt(test: string, key: string): string {
    if (key.length !== 32) {
      throw new Error("key must be exactly 32 characters")
    }

    const encrypted = Buffer.from(test, "base64")
    const keyBuf = Buffer.from(key, "utf-8")

    // const prefix = encrypted.subarray(0, 3)
    try {
      const iv = encrypted.subarray(3, 3 + 12)
      const cipherText = encrypted.subarray(3 + 12, encrypted.length - 16)
      const authTeg = encrypted.subarray(encrypted.length - 16)
      const decipher = createDecipheriv("aes-256-gcm", keyBuf, iv)
      decipher.setAuthTag(authTeg)
      const decrypted = Buffer.concat([
        decipher.update(cipherText),
        decipher.final(),
      ])

      return decrypted.toString("utf-8")
    } catch (e) {
      return ""
    }
  }
}
