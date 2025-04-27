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
  headers?: Record<string, string>
) => Promise<T>;

export type AxiosAdapterType = (instance: AxiosInstance) => RequesterFn;

export interface HttpClient {
  requester<T>(
    url: string,
    method: MethodType,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<T>;
  GET<T>(url: string, headers?: Record<string, string>): Promise<T>;
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

export type User = {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  role: "ADMIN" | "SELLER";
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
