import { PrismaClient } from "@prisma/client"
import { IInvoiceRepository } from "./domain/repository/invoice-repository.interface"
import {
  CreateInvoiceDto,
  IInvoice,
  UpdateInvoiceDto,
} from "./domain/dtos/invoice.dto "

export class InvoiceRepository implements IInvoiceRepository {
  constructor(private readonly db: PrismaClient) {}

  async create({
    number,
    amount,
    product,
    issueDate,
    dueDate,
    clientId,
  }: CreateInvoiceDto): Promise<void> {
    await this.db.invoice.create({
      data: {
        number,
        product,
        amount,
        issueDate,
        dueDate,
        clientId,
      },
    })
  }

  async update({ id, status }: UpdateInvoiceDto): Promise<void> {
    await this.db.invoice.update({
      where: { id },
      data: { status },
    })
  }

  async delete(id: string): Promise<void> {
    await this.db.invoice.delete({ where: { id } })
  }

  async findById(id: string): Promise<IInvoice | null> {
    const invoice = await this.db.invoice.findUnique({
      where: { id },
    })

    return invoice
  }

  async findByNumber(number: string): Promise<IInvoice | null> {
    const invoice = await this.db.invoice.findUnique({
      where: { number },
    })
    return invoice
  }

  async listInvoicesByClientId(clientId: string): Promise<IInvoice[]> {
    const invoices = await this.db.invoice.findMany({
      where: {
        clientId,
      },
    })

    return invoices
  }
}
