export type InvoiceStatus = "PENDING" | "PAID" | "CANCELED"

export interface IInvoice {
  id: string
  number: string
  product: string
  issueDate: Date | string
  dueDate: Date | string
  amount: number
  status: InvoiceStatus
  createdAt: Date | string
  updatedAt: Date | string
}

export interface CreateInvoiceDto {
  number: string
  product: string
  issueDate: Date | string
  dueDate: Date | string
  amount: number
  clientId: string
}

export interface CreateInvoiceServiceDto extends CreateInvoiceDto {}

export interface UpdateInvoiceDto {
  id: string
  status: InvoiceStatus
}

export interface PaidInvoiceServiceDto {
  number: string
}

export interface CanceledInvoiceServiceDto {
  number: string
}

export interface GetInvoiceServiceDto {
  number: string
}

export interface ListAllClientInvoicesServiceDto {
  clientId: string
}
