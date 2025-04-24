import { describe, test } from "node:test"
import { TokenModule } from "../token.module"
import assert from "node:assert"

const sut = TokenModule.factory()
const SECRET_TOKEN = "fake_secret"
const CONTENT_TO_TEST = "test"

type Payload = { sub: string }
describe("Token tests", () => {
  test("create signed token", () => {
    const token = sut.signToken<Payload>(
      { sub: CONTENT_TO_TEST },
      {
        secret: SECRET_TOKEN,
      },
    )
    const jwtParts = token.split(".")
    assert.strictEqual(jwtParts.length, 3)

    const [, payload] = jwtParts

    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    )

    assert(decodedPayload.sub)
    assert.strictEqual(decodedPayload.sub, CONTENT_TO_TEST)
  })

  test("verify if token is valid", () => {
    const token = sut.signToken<{ sub: string }>(
      { sub: CONTENT_TO_TEST },
      {
        secret: SECRET_TOKEN,
      },
    )

    const { payload, error } = sut.verifyToken<Payload>(token, {
      secret: SECRET_TOKEN,
    })

    assert(payload)
    assert.strictEqual(error, undefined)
    assert(payload.sub)
    assert.strictEqual(payload.sub, CONTENT_TO_TEST)
  })
})
