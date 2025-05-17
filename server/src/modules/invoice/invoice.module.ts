import { FastifyInstance } from "fastify"
import { DatabaseModule } from "../db/database.module"
import { InvoiceRepository } from "./invoice.repository"
import { InvoiceServices } from "./invoice.services"
import { InvoiceControllers } from "./invoice.controllers"
import { ClientRepository } from "../clients/client.repository"
import { InvoiceRoutes } from "./invoice.routes"

export class InvoiceModule {
  static build(app: FastifyInstance) {
    const invoiceRepository = DatabaseModule.makeRepository(InvoiceRepository)
    const clientRepository = DatabaseModule.makeRepository(ClientRepository)
    const invoiceServices = new InvoiceServices(
      invoiceRepository,
      clientRepository,
    )
    const invoiceControllers = new InvoiceControllers(invoiceServices)
    const invoiceRoutes = new InvoiceRoutes(app, invoiceControllers)
    return invoiceRoutes.build()
  }
}
