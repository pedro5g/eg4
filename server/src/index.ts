import { fastify } from "fastify"
import { fastifyCors } from "@fastify/cors"
import { fastifyCookie } from "@fastify/cookie"
import { fastifyMultipart } from "@fastify/multipart"
import { globalErrorHandler } from "./core/middlewares/global-error-handler"
import { env } from "./core/env/index"
import { logger } from "./core/logger"
import { EncrypterModule } from "./modules/encrypter/encrypter.module"
import { decorate } from "./core/hooks/decorate"
import { AuthModule } from "./modules/auth/auth.module"
import { UploadModule } from "./modules/uploads/upload.module"
import { StoreModule } from "./modules/store/store.module"
import { ClientModule } from "./modules/clients/client.module"
import { UserModule } from "./modules/user/user.module"
import { InvoiceModule } from "./modules/invoice/invoice.module"
import { ClientFilesModule } from "./modules/client-files/client-files.module"

const app = fastify()

app.register(fastifyCors, {
  origin: env.WEB_ORIGEN,
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
})

app.register(fastifyCookie, {
  secret: {
    sign(value) {
      const encrypt = EncrypterModule.getService("encrypt")
      return encrypt(value, env.COOKIE_SECRET)
    },
    unsign(input) {
      const decrypt = EncrypterModule.getService("decrypt")
      const value = decrypt(input, env.COOKIE_SECRET)

      return {
        valid: true,
        renew: false,
        value: value,
      }
    },
  },
})
app.register(fastifyMultipart, {
  limits: {
    fieldNameSize: 100,
    fieldSize: 1000000,
    fields: 10,
    fileSize: 10000000,
    files: 5,
  },
  attachFieldsToBody: true,
})

decorate(app)

app.register(AuthModule.build, { prefix: `${env.API_PREFIX}/auth` })
app.register(UserModule.build, { prefix: `${env.API_PREFIX}/user` })
app.register(StoreModule.build, { prefix: `${env.API_PREFIX}/store` })
app.register(ClientModule.build, { prefix: `${env.API_PREFIX}/client` })
app.register(InvoiceModule.build, { prefix: `${env.API_PREFIX}/invoice` })
app.register(UploadModule.build, { prefix: `${env.API_PREFIX}/upload` })
app.register(ClientFilesModule.build, {
  prefix: `${env.API_PREFIX}/client-files`,
})

app.setErrorHandler(globalErrorHandler)
app
  .listen({
    port: env.PORT,
    host: env.HOST,
  })
  .then(() => {
    logger.info(
      `Server is running at port ${process.env.PORT} 🚀 on ${env.NODE_ENV} mode`,
    )
  })

export { app }
