import { FastifyReply, FastifyRequest } from "fastify"
import { InvoiceServices } from "./invoice.services"
import {
  getInvoiceSchema,
  listClintInvoiceSchema,
  registerInvoiceSchema,
  updateInvoiceStatusSchema,
} from "@/core/validators/invoice.validators"
import { HTTP_STATUS } from "@/core/constraints"

export class InvoiceControllers {
  constructor(private readonly invoiceServices: InvoiceServices) {}

  async registerInvoice(request: FastifyRequest, reply: FastifyReply) {
    const { clientId, number, amount, dueDate, issueDate, product } =
      registerInvoiceSchema.parse(request.body)

    await this.invoiceServices.registerNewIncome({
      clientId,
      number,
      product,
      amount,
      issueDate,
      dueDate,
    })

    reply
      .status(HTTP_STATUS.CREATED)
      .send({ ok: true, message: "invoice registered successfully" })
  }

  async paidInvoice(request: FastifyRequest, reply: FastifyReply) {
    const { number } = updateInvoiceStatusSchema.parse(request.params)

    await this.invoiceServices.paidInvoice({ number })

    reply.status(HTTP_STATUS.OK).send({ ok: true, message: "Invoice paid" })
  }

  async canceledInvoice(request: FastifyRequest, reply: FastifyReply) {
    const { number } = updateInvoiceStatusSchema.parse(request.params)

    await this.invoiceServices.canceledInvoice({ number })

    reply.status(HTTP_STATUS.OK).send({ ok: true, message: "Invoice canceled" })
  }

  async getInvoice(request: FastifyRequest, reply: FastifyReply) {
    const { number } = getInvoiceSchema.parse(request.params)

    const { invoice } = await this.invoiceServices.getInvoice({ number })
    reply.status(HTTP_STATUS.OK).send({ ok: true, invoice })
  }

  async listClientInvoice(request: FastifyRequest, reply: FastifyReply) {
    const { clientId } = listClintInvoiceSchema.parse(request.params)

    const { invoices } = await this.invoiceServices.listAllClientInvoices({
      clientId,
    })

    reply.status(HTTP_STATUS.OK).send({ ok: true, invoices })
  }
}
