import { RegisterClientSchemaType } from "@/components/forms/clients-forms/schemas/register-client-form-schema";
import { AxiosInstance } from "axios";

export type MethodType = "get" | "post" | "put" | "patch" | "delete";

export enum MethodsEnum {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PATCH = "patch",
  PUT = "put",
}
export type FetchAdapterOpts = RequestInit & {
  baseURL: string;
};

export type RequesterFn = <T>(
  url: string,
  method: MethodType,
  body?: unknown,
  headers?: Record<string, string>,
  params?: unknown
) => Promise<T>;

export type AxiosAdapterType = (instance: AxiosInstance) => RequesterFn;

export interface HttpClient {
  requester<T>(
    url: string,
    method: MethodType,
    body?: unknown,
    headers?: Record<string, string>,
    params?: unknown
  ): Promise<T>;
  GET<T>(
    url: string,
    params?: unknown,
    headers?: Record<string, string>
  ): Promise<T>;
  POST<T, B = unknown>(
    url: string,
    body?: B,
    headers?: Record<string, string>
  ): Promise<T>;
  PUT<T, B = unknown>(
    url: string,
    body?: B,
    headers?: Record<string, string>
  ): Promise<T>;
  DELETE<T>(url: string, headers?: Record<string, string>): Promise<T>;
  PATCH<T, B = unknown>(
    url: string,
    body?: B,
    headers?: Record<string, string>
  ): Promise<T>;
}

export type ApiError = {
  errorCode: string;
  ok: false;
} & Error;
export type Status = "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING";
export type User = {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  role: "ADMIN" | "SELLER";
};

export type Client = {
  id: string;
  code: string;
  address: string;
  state: string;
  cityCode: string | null;
  name: string;
  tradeName: string | null;
  neighborhood: string | null;
  zipCode: string | null;
  city: string;
  areaCode: string | null;
  phone: string | null;
  type: string | null;
  email: string | null;
  country: string | null;
  taxId: string | null;
  openingDate: string | null;
  homepage: string | null;
  status: Status;
  registrationDate: Date | null;
  storeId: number | null;
  authorId: string;
};

export type SignUpBodyType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignUpResponseType = {
  ok: boolean;
  message: string;
};

export type SignInBodyType = {
  email: string;
  password: string;
};

export type SignInResponseType = {
  ok: true;
  message: string;
};

export type ProfileResponseType = {
  ok: true;
  message: string;
  profile: User;
};

export type UpdateAvatarProfileBodyType = FormData;
export type UpdateAvatarProfileResponseType = {
  ok: true;
  message: string;
};

export type UpdateProfileBodyType = {
  name: string;
  phone: string | null;
  address: string | null;
};

export type UpdateProfileResponseType = {
  ok: true;
  message: string;
};

export type LogoutResponseType = {
  ok: true;
  message: string;
};

export type CreateStoreBodyType = {
  name: string;
  address: string | null;
};

export type CreateStoreResponseType = {
  ok: true;
  message: string;
};

export type GetStoresResponseType = {
  stores: {
    id: number;
    code: string;
    name: string;
    address: string | null;
  }[];
};

export type RegisterClientBodyType = RegisterClientSchemaType;
export type RegisterClientResponseType = {
  ok: true;
  message: string;
};
export type ListClientsBodyType = {
  page?: number;
  take?: number;
  q?: string | undefined;
  s?: "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING" | undefined;
};

export type ListClientsResponseType = {
  ok: true;
  data: {
    items: Client[];
    meta: {
      total: number;
      page: number;
      take: number;
      pageCount: number;
    };
  };
};
