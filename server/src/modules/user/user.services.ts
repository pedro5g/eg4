import { NotFoundException } from "@/core/exceptions"
import { UploadService } from "../uploads/upload.service"
import {
  UpdateAvatarProfileServiceDto,
  UpdateProfileServiceDto,
} from "./domain/dtos/user.dtos"
import { IUserRepository } from "./domain/repository/user-repository.interface"

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

    return { profile }
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

    await this.userRepository.updateProfile({ ...user, avatarUrl })
  }
  async updateProfile({ id, name }: UpdateProfileServiceDto) {
    const user = await this.userRepository.getUserById(id)

    if (!user) {
      throw new NotFoundException("Invalid id, user not found")
    }

    await this.userRepository.updateProfile({ ...user, name })
  }
}
