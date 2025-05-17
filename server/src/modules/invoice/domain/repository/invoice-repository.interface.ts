import {
  CreateInvoiceDto,
  IInvoice,
  UpdateInvoiceDto,
} from "../dtos/invoice.dto "

export interface IInvoiceRepository {
  create(args: CreateInvoiceDto): Promise<void>
  update(args: UpdateInvoiceDto): Promise<void>
  delete(id: string): Promise<void>
  findById(id: string): Promise<IInvoice | null>
  findByNumber(number: string): Promise<IInvoice | null>
  listInvoicesByClientId(clientId: string): Promise<IInvoice[]>
}
