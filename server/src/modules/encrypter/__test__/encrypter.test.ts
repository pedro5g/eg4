import { describe, test } from "node:test"
import assert from "node:assert"
import { EncrypterModule } from "../encrypter.module"

const sut = EncrypterModule.factory()

describe("Encrypter tests", () => {
  test("convert text to hash", async () => {
    const tests = ["test1", "test2", "test3", "test4", "test5", "test6"]

    const result: string[] = []

    tests.forEach(async (text) => {
      const hash = await sut.toHash(text)
      result.push(hash)
    })

    const notEqual = result.every((hash, i) => hash === tests[i])
    const successfully = result.every((hash) => hash.split(".").length)

    assert.strictEqual(notEqual, true)
    assert.strictEqual(successfully, true)
  })

  test("compare text with hash", async () => {
    const passwordText = "test_password"
    const hash = await sut.toHash(passwordText)

    assert.notStrictEqual(passwordText, hash)

    const match = await sut.compare(passwordText, hash)

    assert.strictEqual(match, true)
  })

  test("encrypt text", () => {
    const KEY = "01234567890123456789012345678901"
    const ORIGINAL_TEXT =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"

    const textEncrypted = sut.encrypt(ORIGINAL_TEXT, KEY)

    assert(textEncrypted)
    assert.notDeepStrictEqual(textEncrypted, ORIGINAL_TEXT)
  })

  test("Decrypt text", () => {
    const KEY = "01234567890123456789012345678901"
    const ORIGINAL_TEXT =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5MDcwMzIwMH0.4A5vK8B-YJzQJfAdTQk9pZSl0Ac_M4w5N9AOrhBQmFw"

    const textEncrypted = sut.encrypt(ORIGINAL_TEXT, KEY)
    const textDecrypted = sut.decrypt(textEncrypted, KEY)

    assert(textDecrypted)
    assert.strictEqual(ORIGINAL_TEXT, textDecrypted)
  })
})
