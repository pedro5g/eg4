import { BadRequestException, NotFoundException } from "@/core/exceptions"
import { IClientRepository } from "../clients/domain/repository/client-repository.interface"
import {
  CreateInvoiceServiceDto,
  PaidInvoiceServiceDto,
} from "./domain/dtos/invoice.dto "
import { IInvoiceRepository } from "./domain/repository/invoice-repository.interface"

export class InvoiceService {
  constructor(
    private readonly invoiceRepository: IInvoiceRepository,
    private readonly clientRepository: IClientRepository,
  ) {}

  async registerNewIncome({
    amount,
    number,
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
      issueDate,
      dueDate,
      clientId,
    })
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
}
