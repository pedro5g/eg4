import { API } from "./axios";
import { AxiosAdapter, CreateHttpClientAdapter } from "./http-adapter";
import {
  ClientProfileResponseType,
  CreateStoreBodyType,
  CreateStoreResponseType,
  CursorPaginationBodyType,
  CursorPaginationResponseType,
  GetInvoiceBodyType,
  GetInvoiceResponseType,
  GetStoresResponseType,
  ListClientInvoicesBodyType,
  ListClientInvoicesResponseType,
  ListClientsBodyType,
  ListClientsResponseType,
  LogoutResponseType,
  ProfileResponseType,
  RegisterClientBodyType,
  RegisterClientResponseType,
  RegisterInvoiceBodyType,
  RegisterInvoiceResponseType,
  SignInBodyType,
  SignInResponseType,
  SignUpBodyType,
  SignUpResponseType,
  SummaryResponseType,
  UpdateAvatarProfileBodyType,
  UpdateAvatarProfileResponseType,
  UpdateClienteProfileBodyType,
  UpdateClientProfileResponseType,
  UpdateInvoiceStatusBodyType,
  UpdateInvoiceStatusResponseType,
  UpdateProfileBodyType,
  UpdateProfileResponseType,
} from "./types";

const axiosAdapter = AxiosAdapter(API);
const httpClient = CreateHttpClientAdapter(axiosAdapter);

export const ApiSignUp = async <T extends SignUpBodyType>(body: T) => {
  return await httpClient.POST<SignUpResponseType, T>("/auth/register", body);
};

export const ApiSignIn = async <T extends SignInBodyType>(body: T) => {
  return await httpClient.POST<SignInResponseType, T>("/auth/login", body);
};

export const ApiProfile = async () => {
  return await httpClient.GET<ProfileResponseType>("/user/profile");
};

export const ApiUpdateAvatarProfile = async <
  T extends UpdateAvatarProfileBodyType
>(
  body: T
) => {
  return await httpClient.PATCH<UpdateAvatarProfileResponseType, T>(
    "/user/update/avatar",
    body,
    {
      "Content-Type": "multipart/form-data",
    }
  );
};

export const ApiUpdateProfile = async <T extends UpdateProfileBodyType>(
  body: T
) => {
  return await httpClient.PATCH<UpdateProfileResponseType, T>(
    "/user/update/profile",
    body
  );
};

export const ApiLogout = async () => {
  return await httpClient.GET<LogoutResponseType>("/auth/logout");
};

export const ApiCreateStore = async <T extends CreateStoreBodyType>(
  body: T
) => {
  return await httpClient.POST<CreateStoreResponseType, T>(
    "/store/register",
    body
  );
};

export const ApiListStores = async () => {
  return await httpClient.GET<GetStoresResponseType>("/store/list");
};

export const ApiRegisterClient = async <T extends RegisterClientBodyType>(
  body: T
) => {
  return await httpClient.POST<RegisterClientResponseType, T>(
    "/client/register",
    body
  );
};

export const ApiListClients = async ({
  page = 0,
  take = 10,
  q,
  s,
}: ListClientsBodyType) => {
  return await httpClient.GET<ListClientsResponseType>(`/client/list-clients`, {
    page,
    take,
    q,
    s: s,
  });
};

export const ApiClientProfile = async (clientCode: string) => {
  return await httpClient.GET<ClientProfileResponseType>(
    `/client/profile/${clientCode}`
  );
};

export const ApiUpdateClientProfile = async <
  T extends UpdateClienteProfileBodyType
>(
  body: T
) => {
  return await httpClient.PATCH<UpdateClientProfileResponseType>(
    "/client/update",
    body
  );
};

export const ApiGetSummary = async () => {
  return await httpClient.GET<SummaryResponseType>("/client/summary");
};

export const exportAllClientsEndpoint = `${
  import.meta.env.VITE_API_URL
}/client/export-all-clients`;

export const ApiRegisterInvoice = async <T extends RegisterInvoiceBodyType>(
  body: T
) => {
  return await httpClient.POST<RegisterInvoiceResponseType, T>(
    "/invoice/register",
    body
  );
};

export const ApiPaidInvoice = async <T extends UpdateInvoiceStatusBodyType>({
  number,
}: T) => {
  return await httpClient.PATCH<UpdateInvoiceStatusResponseType>(
    `/invoice/${number}/paid`
  );
};
export const ApiCAnceledInvoice = async <
  T extends UpdateInvoiceStatusBodyType
>({
  number,
}: T) => {
  return await httpClient.PATCH<UpdateInvoiceStatusResponseType>(
    `/invoice/${number}/canceled`
  );
};

export const ApiGetInvoice = async <T extends GetInvoiceBodyType>({
  number,
}: T) => {
  return await httpClient.GET<GetInvoiceResponseType>(`/invoice/${number}`);
};

export const ApiListClientInvoices = async <
  T extends ListClientInvoicesBodyType
>({
  clientId,
}: T) => {
  return await httpClient.GET<ListClientInvoicesResponseType>(
    `/invoice/${clientId}/invoices`
  );
};

export const ApiClientsCursorPagination = async ({
  take,
  lastCursor,
  name,
}: CursorPaginationBodyType) => {
  return await httpClient.GET<CursorPaginationResponseType>(`/client/cursor`, {
    take,
    lastCursor,
    name,
  });
};
