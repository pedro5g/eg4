import { NotFoundException } from "@/core/exceptions"
import { UploadService } from "../uploads/upload.service"
import {
  UpdateAvatarProfileServiceDto,
  UpdateProfileServiceDto,
} from "./domain/dtos/user.dtos"
import { IUserRepository } from "./domain/repository/user-repository.interface"
import { env } from "@/core/env"

export class UserServices {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly uploadService: UploadService,
  ) {}

  async getProfile(id: string) {
    const profile = await this.userRepository.getProfileById(id)

    if (!profile) {
      throw new NotFoundException("Invalid id, user not found")
    }

    const url = profile.avatarUrl
      ? `http://localhost:8080/${env.API_PREFIX}/upload/files/${profile.avatarUrl}`
      : null

    return { profile: { ...profile, avatarUrl: url } }
  }

  async updateAvatarProfile({
    id,
    avatarImage,
  }: UpdateAvatarProfileServiceDto) {
    const user = await this.userRepository.getUserById(id)

    if (!user) {
      throw new NotFoundException("Invalid id, user not found")
    }

    let avatarUrl = user.avatarUrl

    if (avatarImage) {
      const { bucketName, fileName } = await this.uploadService.upload({
        file: avatarImage,
        bucket: "profile",
      })
      avatarUrl = `${bucketName}/${fileName}`
    }

    if (user.avatarUrl && avatarUrl) {
      const [bucketName, fileName] = user.avatarUrl.split("/")
      await this.uploadService.deleteFile({ bucketName, fileName })
    }

    await this.userRepository.updateProfile({ ...user, avatarUrl })
  }
  async updateProfile({ id, name, address, phone }: UpdateProfileServiceDto) {
    const user = await this.userRepository.getUserById(id)

    if (!user) {
      throw new NotFoundException("Invalid id, user not found")
    }

    await this.userRepository.updateProfile({ ...user, name, address, phone })
  }
}
