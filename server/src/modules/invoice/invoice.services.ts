import { BadRequestException, NotFoundException } from "@/core/exceptions"
import { IClientRepository } from "../clients/domain/repository/client-repository.interface"
import {
  CanceledInvoiceServiceDto,
  CreateInvoiceServiceDto,
  DeleteInvoiceServiceDto,
  GetInvoiceServiceDto,
  ListAllClientInvoicesServiceDto,
  PaidInvoiceServiceDto,
} from "./domain/dtos/invoice.dto "
import { IInvoiceRepository } from "./domain/repository/invoice-repository.interface"

export class InvoiceServices {
  constructor(
    private readonly invoiceRepository: IInvoiceRepository,
    private readonly clientRepository: IClientRepository,
  ) {}

  async registerNewIncome({
    amount,
    number,
    product,
    issueDate,
    dueDate,
    clientId,
  }: CreateInvoiceServiceDto) {
    const clienteExits = await this.clientRepository.findById(clientId)

    if (!clienteExits) {
      throw new NotFoundException("Invalid client id, client not found")
    }

    await this.invoiceRepository.create({
      amount,
      number,
      product,
      issueDate,
      dueDate,
      clientId,
    })
  }

  async deleteInvoice({ invoiceId }: DeleteInvoiceServiceDto) {
    const invoice = await this.invoiceRepository.findById(invoiceId)

    if (!invoice) {
      throw new NotFoundException("Invalid invoice number, invoice not found")
    }

    await this.invoiceRepository.delete(invoiceId)
  }

  async paidInvoice({ number }: PaidInvoiceServiceDto) {
    const invoice = await this.invoiceRepository.findByNumber(number)

    if (!invoice) {
      throw new NotFoundException("Invalid invoice number, invoice not found")
    }

    if (invoice.status !== "PENDING") {
      throw new BadRequestException(
        "You can be pay an invoice that's be pending",
      )
    }

    await this.invoiceRepository.update({
      id: invoice.id,
      status: "PAID",
    })
  }

  async canceledInvoice({ number }: CanceledInvoiceServiceDto) {
    const invoice = await this.invoiceRepository.findByNumber(number)

    if (!invoice) {
      throw new NotFoundException("Invalid invoice number, invoice not found")
    }

    if (invoice.status !== "PENDING") {
      throw new BadRequestException(
        "You can be canceled an invoice that's be pending",
      )
    }

    await this.invoiceRepository.update({
      id: invoice.id,
      status: "CANCELED",
    })
  }

  async getInvoice({ number }: GetInvoiceServiceDto) {
    const invoice = await this.invoiceRepository.findByNumber(number)

    if (!invoice) {
      throw new NotFoundException("Invalid invoice number, invoice not found")
    }
    return { invoice }
  }

  async listAllClientInvoices({ clientId }: ListAllClientInvoicesServiceDto) {
    const clientExist = await this.clientRepository.findById(clientId)

    if (!clientExist) {
      throw new NotFoundException("Invalid client id, client not found")
    }

    const invoices =
      await this.invoiceRepository.listInvoicesByClientId(clientId)

    return { invoices }
  }
}
