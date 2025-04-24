import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@/core/exceptions"
import { RegisterUserDTO, UserAuthDTO } from "./domain/dtos/user.dtos"
import { IAuthRepository } from "./domain/repositories/auth-repository.interface"
import { IEncrypterRepository } from "../encrypter/domain/repository/encrypter-repository.interface"
import {
  AccessTokenPayload,
  accessTokenSignOptions,
  RefreshTokenPayload,
  refreshTokenSignOptions,
} from "@/core/jwt"
import { ITokenRepository } from "../token/domain/repository/token-repository.interface"

export class AuthServices {
  constructor(
    private readonly repository: IAuthRepository,
    private readonly encrypter: IEncrypterRepository,
    private readonly token: ITokenRepository,
  ) {}

  public async registerUser({ name, email, password }: RegisterUserDTO) {
    const userExists = await this.repository.findByEmail(email)

    if (userExists) {
      throw new BadRequestException("You already have an account, please login")
    }

    const passwordHash = await this.encrypter.toHash(password)

    await this.repository.create({ name, email, password: passwordHash })
  }

  public async loginService({ email, password }: UserAuthDTO) {
    const user = await this.repository.findByEmail(email)

    if (!user) {
      throw new BadRequestException("Invalid credentials")
    }

    const match = await this.encrypter.compare(password, user.password)

    if (!match) {
      throw new BadRequestException("Invalid credentials")
    }

    const accessToken = this.token.signToken<AccessTokenPayload>(
      {
        id: user.id,
        role: user.role,
      },
      accessTokenSignOptions,
    )
    const refreshToken = this.token.signToken<RefreshTokenPayload>(
      { id: user.id },
      refreshTokenSignOptions,
    )

    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    }
  }

  public async revalidateToken(refresh: string) {
    const { payload } = this.token.verifyToken<RefreshTokenPayload>(
      refresh,
      refreshTokenSignOptions,
    )

    if (!payload) {
      throw new UnauthorizedException()
    }

    const user = await this.repository.findById(payload.id)

    if (!user) {
      throw new NotFoundException("User not found")
    }

    const accessToken = this.token.signToken<AccessTokenPayload>(
      {
        id: user.id,
        role: user.role,
      },
      accessTokenSignOptions,
    )
    const refreshToken = this.token.signToken<RefreshTokenPayload>(
      { id: user.id },
      refreshTokenSignOptions,
    )

    return { accessToken, refreshToken }
  }
}
