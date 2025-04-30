export type Status = "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING"

export type IClient = {
  id: string
  code: string
  address: string
  state: string
  cityCode: string | null
  name: string
  tradeName: string | null
  neighborhood: string | null
  zipCode: string | null
  city: string
  areaCode: string | null
  phone: string | null
  type: string | null
  email: string | null
  country: string | null
  taxId: string | null
  openingDate: string | null
  homepage: string | null
  status: Status
  registrationDate: Date | null
  storeId: number | null
  authorId: string
}

export interface RegisterClientDto {
  code: string
  address: string
  state: string
  cityCode: string | null
  name: string
  tradeName: string | null
  neighborhood: string | null
  zipCode: string | null
  city: string
  areaCode: string | null
  phone: string | null
  type: string | null
  email: string | null
  country: string | null
  taxId: string | null
  openingDate: string | null
  homepage: string | null
  status: Status
  storeId: number | null
  authorId: string
}

export interface RegisterClientServiceDto {
  address: string
  state: string
  cityCode: string | null
  name: string
  tradeName: string | null
  neighborhood: string | null
  zipCode: string | null
  city: string
  areaCode: string | null
  phone: string | null
  type: string | null
  email: string | null
  country: string | null
  taxId: string | null
  openingDate: string | null
  homepage: string | null
  status: Status
  storeCode: string | null
  authorId: string
}

export interface UpdateClientServiceDto {
  code: string
  address: string
  state: string
  cityCode: string | null
  name: string
  tradeName: string | null
  neighborhood: string | null
  zipCode: string | null
  city: string
  areaCode: string | null
  phone: string | null
  type: string | null
  email: string | null
  country: string | null
  taxId: string | null
  openingDate: string | null
  homepage: string | null
  status: Status
}
