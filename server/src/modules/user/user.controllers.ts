import { FastifyReply, FastifyRequest } from "fastify"
import { UserServices } from "./user.services"
import { HTTP_STATUS } from "@/core/constraints"
import { toFile, updateUserSchema } from "@/core/validators/user.validators"

export class UserControllers {
  constructor(private readonly userServices: UserServices) {}

  async profile(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user.id
    const { profile } = await this.userServices.getProfile(userId)
    reply.status(HTTP_STATUS.OK).send({ ok: true, profile })
  }

  async updateAvatarProfile(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user.id
    const file = await req.file()
    const buffer = await file?.toBuffer()

    const avatarImage = toFile({
      data: buffer,
      filename: file?.filename,
      mimetype: file?.mimetype,
    })

    await this.userServices.updateAvatarProfile({
      id: userId,
      avatarImage,
    })

    reply
      .status(HTTP_STATUS.OK)
      .send({ ok: true, message: "Avatar profile updated successfully" })
  }

  async updateProfile(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user.id
    const { name } = updateUserSchema.parse(req.body)

    await this.userServices.updateProfile({ id: userId, name })

    reply
      .status(HTTP_STATUS.OK)
      .send({ ok: true, message: "Profile updated successfully" })
  }
}
