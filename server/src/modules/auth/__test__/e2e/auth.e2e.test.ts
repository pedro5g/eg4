import { DatabaseModule } from "@/modules/db/database.module"
import { FastifyInstance } from "fastify"
import assert from "node:assert"
import { after, before, describe, it } from "node:test"

const BASE_URL = "http://localhost:8081/api/v1/auth"

const db = DatabaseModule.factory()
describe("E2E auth tests", () => {
  let server: FastifyInstance

  before(async () => {
    server = (await import("@/index")).app
    await new Promise((resolve) => server.server.once("listening", resolve))
  })

  after((done) => server.server.close(() => done))
  describe("Register [/auth/register]", () => {
    it("Should be able register user with correct info", async () => {
      const data = {
        name: "Jhon test",
        email: "testregister@email.com",
        password: "123456",
        confirmPassword: "123456",
      }

      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify(data),
      })

      assert.strictEqual(response.status, 201)

      const result = await response.json()

      assert(result)
      assert.strictEqual(result.message, "User registered successfully")
      assert.strictEqual(result.ok, true)

      const userOnDb = await db.user.findUnique({
        where: {
          email: data.email,
        },
      })

      assert(userOnDb)
      assert(userOnDb.id)
      assert(userOnDb.createdAt)
      assert(userOnDb.updatedAt)

      await db.user.delete({ where: { id: userOnDb.id } })
    })

    it("Should alert when user already have an account", async () => {
      const data = {
        name: "Jhon test",
        email: "testregister@email.com",
        password: "123456",
        confirmPassword: "123456",
      }
      await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify(data),
      })

      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify(data),
      })

      assert.strictEqual(response.status, 400)

      const result = await response.json()

      assert(result)
      assert.strictEqual(
        result.message,
        "You already have an account, please login",
      )
      assert.strictEqual(result.ok, false)

      const userOnDb = await db.user.findUnique({
        where: {
          email: data.email,
        },
      })
      assert(userOnDb)
      await db.user.delete({ where: { id: userOnDb.id } })
    })

    it("Should validate infos before try register", async () => {
      const data = {
        name: "",
        email: "testregister.com",
        password: "12345",
        confirmPassword: "1234567",
      }
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify(data),
      })

      assert.strictEqual(response.status, 400)

      const result = await response.json()

      assert(result)
      assert.strictEqual(result.ok, false)
      assert.strictEqual(result.message, "Validation failed")
      assert.deepStrictEqual(result.errors, [
        {
          field: "name",
          message: "String must contain at least 3 character(s)",
        },
        { field: "email", message: "Invalid email" },
        {
          field: "password",
          message: "String must contain at least 6 character(s)",
        },
        { field: "confirmPassword", message: "passwords don't matches" },
      ])
    })
  })

  describe("Login [/auth/login]", () => {
    it("Should be able to login with valid credentials", async () => {
      const data = {
        name: "Jhon test",
        email: "testregister@email.com",
        password: "123456",
        confirmPassword: "123456",
      }

      await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify(data),
      })

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      assert.strictEqual(response.status, 200)
      const cookies = response.headers.getSetCookie()
      const result = await response.json()

      assert.strictEqual(result.ok, true)
      assert.strictEqual(result.message, "Login successfully")
      assert(result.user)

      assert.strictEqual(cookies.length, 2)
      await db.user.delete({ where: { id: result.user.id } })
    })
    it("Should not be able login with invalid credentials", async () => {
      const data = {
        name: "Jhon test",
        email: "testregister@email.com",
        password: "123456",
        confirmPassword: "123456",
      }

      await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify(data),
      })

      let response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({
          email: "fake@gmail.com",
          password: data.password,
        }),
      })

      assert.strictEqual(response.status, 400)

      let result = await response.json()

      assert.strictEqual(result.ok, false)
      assert.strictEqual(result.message, "Invalid credentials")
      assert.strictEqual(result.user, undefined)

      response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({
          email: data.email,
          password: "fake_password",
        }),
      })

      assert.strictEqual(response.status, 400)

      result = await response.json()

      assert.strictEqual(result.ok, false)
      assert.strictEqual(result.message, "Invalid credentials")
      assert.strictEqual(result.user, undefined)

      await db.user.delete({ where: { email: data.email } })
    })
  })

  describe("Logout [/auth/logout]", () => {
    it("Should be able logout", async () => {
      const data = {
        name: "Jhon test",
        email: "testregister@email.com",
        password: "123456",
        confirmPassword: "123456",
      }

      await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify(data),
        credentials: "include",
      })

      const loginResponse = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        credentials: "include",
      })

      const cookies = loginResponse.headers.getSetCookie()

      assert.strictEqual(cookies.length, 2)

      const logout = await fetch(`${BASE_URL}/logout`, {
        method: "GET",
        headers: [["Content-Type", "application/json"]],
        credentials: "include",
      })

      assert.strictEqual(logout.status, 200)

      const logoutCookies = logout.headers.getSetCookie()
      const cleaned = logoutCookies.every((cookie) => {
        const [name] = cookie.split(";")
        const [_, value] = name.split("=")
        return value === ""
      })

      assert.strictEqual(cleaned, true)
      await db.user.delete({ where: { email: data.email } })
    })
  })

  describe("Refresh [/auth/refresh]", () => {
    it("Should be able revalidate session token if refresh toke is valid", async () => {
      const data = {
        name: "Jhon test",
        email: "testregister@email.com",
        password: "123456",
        confirmPassword: "123456",
      }

      await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify(data),
        credentials: "include",
      })

      const loginResponse = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        credentials: "include",
      })

      const setCookieHeaders = loginResponse.headers.getSetCookie()
      const refreshToken = setCookieHeaders.find((cookie) =>
        cookie.startsWith("refreshToken"),
      )

      assert(refreshToken, "refreshToken must be present")
      const response = await fetch(`${BASE_URL}/refresh`, {
        method: "GET",
        headers: [["Cookie", refreshToken]],
        credentials: "include",
      })
      const result = await response.json()

      const cookies = response.headers.getSetCookie()

      assert.strictEqual(response.status, 200)

      assert(result.ok)
      assert.strictEqual(result.message, "Revalidated successfully")
      assert.strictEqual(cookies.length, 2)

      await db.user.delete({ where: { email: data.email } })
    })
  })
})
