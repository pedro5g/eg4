export type Status = "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING"

export type IClient = {
  id: string
  code: string
  address: string
  state: string
  cityCode: string | null
  name: string
  tradeName: string
  neighborhood: string | null
  zipCode: string | null
  city: string
  areaCode: string | null
  phone: string | null
  type: string
  email: string | null
  country: string | null
  taxId: string | null
  openingDate: Date | string | null
  homepage: string | null
  status: Status
  registrationDate: Date | null
  storeId: number | null
}

export interface RegisterClientDto {
  code: string
  address: string
  state: string
  cityCode: string | null
  name: string
  tradeName: string
  neighborhood: string | null
  zipCode: string | null
  city: string
  areaCode: string | null
  phone: string | null
  type: string
  email: string | null
  country: string | null
  taxId: string | null
  openingDate: Date | string | null
  homepage: string | null
  status: Status
  storeId: number | null
}

export interface RegisterClientServiceDto {
  address: string
  state: string
  cityCode: string | null
  name: string
  tradeName: string
  neighborhood: string | null
  zipCode: string | null
  city: string
  areaCode: string | null
  phone: string | null
  type: string
  email: string | null
  country: string | null
  taxId: string | null
  openingDate: Date | string | null
  homepage: string | null
  status: Status
  storeId: number | null
}
