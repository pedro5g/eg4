import { Multipart } from "@fastify/multipart"
import { FastifyReply, FastifyRequest } from "fastify"
import { toFile } from "../validators/user.validators"

export async function multipartResolver(
  request: FastifyRequest,
  _reply: FastifyReply,
) {
  if (request.headers["content-type"]?.includes("multipart/form-data;")) {
    const formFields: Record<string, unknown> = {}

    const parts = request.body as Record<string, Multipart>

    for await (const [key, multipart] of Object.entries(parts)) {
      if (multipart.type === "field") {
        formFields[key] = multipart.value
      } else {
        formFields[key] = toFile({
          data: await multipart.toBuffer(),
          mimetype: multipart.mimetype,
          filename: multipart.filename,
        })
      }
    }
    delete request.body
    Object.assign(request, { body: formFields })
  }
}
