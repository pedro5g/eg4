import { FastifyInstance } from "fastify"
import { isAuthenticated } from "@/core/middlewares/is-authenticated"
import { InvoiceControllers } from "./invoice.controllers"

export class InvoiceRoutes {
  constructor(
    private readonly app: FastifyInstance,
    private readonly invoiceControllers: InvoiceControllers,
  ) {}

  public build() {
    this.app.post(
      "/register",
      { preHandler: [isAuthenticated] },
      this.invoiceControllers.registerInvoice.bind(this.invoiceControllers),
    )
    this.app.delete(
      "/:invoiceId",
      { preHandler: [isAuthenticated] },
      this.invoiceControllers.deleteInvoice.bind(this.invoiceControllers),
    )
    this.app.patch(
      "/:number/paid",
      { preHandler: [isAuthenticated] },
      this.invoiceControllers.paidInvoice.bind(this.invoiceControllers),
    )
    this.app.patch(
      "/:number/canceled",
      { preHandler: [isAuthenticated] },
      this.invoiceControllers.canceledInvoice.bind(this.invoiceControllers),
    )
    this.app.get(
      "/:number",
      { preHandler: [isAuthenticated] },
      this.invoiceControllers.getInvoice.bind(this.invoiceControllers),
    )
    this.app.get(
      "/:clientId/invoices",
      { preHandler: [isAuthenticated] },
      this.invoiceControllers.listClientInvoice.bind(this.invoiceControllers),
    )

    return this.app
  }
}
