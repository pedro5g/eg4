import { beforeEach, describe, it } from "node:test"
import assert from "node:assert"
import { AuthServices } from "../auth.services"
import { InMemoryAuthRepository } from "./utils/in-memory-auth-repository"
import { EncrypterService } from "../../encrypter/encrypter.service"
import { EncrypterModule } from "../../encrypter/encrypter.module"
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@/core/exceptions"
import { spyOn } from "@test/utils/spy-on"
import { TokenService } from "@/modules/token/token.service"
import { TokenModule } from "@/modules/token/token.module"
import { RefreshTokenPayload, refreshTokenSignOptions } from "@/core/jwt"

let sut: AuthServices
let repository: InMemoryAuthRepository
let encrypter: EncrypterService
let token: TokenService

beforeEach(() => {
  repository = new InMemoryAuthRepository()
  encrypter = EncrypterModule.factory()
  token = TokenModule.factory()
  sut = new AuthServices(repository, encrypter, token)
})

describe("Auth Services Tests", () => {
  describe("Register user service", () => {
    it("Should be able register user", async () => {
      assert(sut.registerUser)

      const testData = {
        name: "Jhon",
        email: "test@email.com",
        password: "password",
      }

      const spyCreate = spyOn(repository, "create")
      const spyFindByEmail = spyOn(repository, "findByEmail")
      const spyToHash = spyOn(encrypter, "toHash")

      await sut.registerUser(testData)

      assert.strictEqual(spyCreate.calleds(), 1)
      assert.strictEqual(spyFindByEmail.calleds(), 1)
      assert.strictEqual(spyToHash.calleds(), 1)

      assert.strictEqual(repository.users.length, 1)

      const userOnDb = repository.users[0]

      assert(userOnDb)
      assert(userOnDb.id)
      assert.strictEqual(userOnDb.name, testData.name)
      assert.strictEqual(userOnDb.email, testData.email)
      assert.strictEqual(userOnDb.role, "SELLER")
    })

    it("should not be able register new user with same email", async () => {
      const testData = {
        name: "Jhon",
        email: "test@email.com",
        password: "password",
      }

      await sut.registerUser(testData)

      const error = await sut.registerUser(testData).catch((error) => error)

      assert.strictEqual(error instanceof BadRequestException, true)
      assert.strictEqual(
        error.message,
        "You already have an account, please login",
      )
      assert.strictEqual(repository.users.length, 1)
    })
  })

  describe("Login service", () => {
    it("should be able to login with valid credentials", async () => {
      const testData = {
        name: "Jhon",
        email: "test@email.com",
        password: "password",
      }

      const spyFindByEmail = spyOn(repository, "findByEmail")
      const spyCompare = spyOn(encrypter, "compare")
      const spySignToken = spyOn(token, "signToken")

      await sut.registerUser(testData)
      const result = await sut.loginService({ ...testData })

      assert(result)
      assert(result.user)
      assert(result.accessToken)
      assert(result.refreshToken)

      assert.strictEqual(spyFindByEmail.calleds(), 2)
      assert.strictEqual(spyCompare.calleds(), 1)
      assert.strictEqual(spySignToken.calleds(), 2)
    })

    it("should not be able to login with invalid credentials", async () => {
      const testData = {
        name: "Jhon",
        email: "test@email.com",
        password: "password",
      }

      const spyCompare = spyOn(encrypter, "compare")

      await sut.registerUser(testData)
      let error = await sut
        .loginService({
          email: "incorrect_email",
          password: testData.password,
        })
        .catch((error) => error)

      assert.strictEqual(error instanceof BadRequestException, true)
      assert.strictEqual(error.message, "Invalid credentials")

      error = await sut
        .loginService({ email: testData.email, password: "incorrect_password" })
        .catch((error) => error)

      assert.strictEqual(error instanceof BadRequestException, true)
      assert.strictEqual(error.message, "Invalid credentials")
      assert.strictEqual(spyCompare.calleds(), 1)
    })
  })

  describe("Revalidate token service", () => {
    it("should be able to revalidate tokes with a valid refresh token", async () => {
      const testData = {
        name: "Jhon",
        email: "test@email.com",
        password: "password",
      }

      await sut.registerUser(testData)
      const { refreshToken } = await sut.loginService({
        ...testData,
      })

      const spySignToken = spyOn(token, "signToken")
      const spyVerifyToken = spyOn(token, "verifyToken")

      const result = await sut.revalidateToken(refreshToken)

      assert(result)
      assert(result.accessToken)
      assert(result.refreshToken)
      assert.strictEqual(spyVerifyToken.calleds(), 1)
      assert.strictEqual(spySignToken.calleds(), 2)
    })
    it("should not be able to revalidate tokes with a invalid refresh token", async () => {
      const refresh = token.signToken<RefreshTokenPayload>(
        { id: "fake_id" },
        {
          ...refreshTokenSignOptions,
          expiresIn: "0ms",
        },
      )
      const spySignToken = spyOn(token, "signToken")
      const spyVerifyToken = spyOn(token, "verifyToken")

      const error = await sut.revalidateToken(refresh).catch((error) => error)

      assert.strictEqual(error instanceof UnauthorizedException, true)
      assert.strictEqual(error.message, "Unauthorized Access")
      assert.strictEqual(spyVerifyToken.called(), true)
      assert.strictEqual(spySignToken.called(), false)
    })
    it("should not be able to revalidate tokes with a invalid payload", async () => {
      const refresh = token.signToken<RefreshTokenPayload>(
        { id: "fake_id" },
        {
          ...refreshTokenSignOptions,
        },
      )

      const spySignToken = spyOn(token, "signToken")
      const spyVerifyToken = spyOn(token, "verifyToken")
      const spyFindById = spyOn(repository, "findById")

      const error = await sut.revalidateToken(refresh).catch((error) => error)

      assert.strictEqual(error instanceof NotFoundException, true)
      assert.strictEqual(error.message, "User not found")

      assert.strictEqual(spyVerifyToken.called(), true)
      assert.strictEqual(spySignToken.called(), false)
      assert.strictEqual(spyFindById.calleds(), 1)
    })
  })
})
