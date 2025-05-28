import { API } from "./axios";
import { AxiosAdapter, CreateHttpClientAdapter } from "./http-adapter";
import {
  ClientProfileResponseType,
  CreateClientFileBodyType,
  CreateClientFileReposeType,
  CreateStoreBodyType,
  CreateStoreResponseType,
  CursorPaginationBodyType,
  CursorPaginationResponseType,
  DeleteClientBodyType,
  DeleteClientFileBodyType,
  DeleteClientFileReturnType,
  DeleteClientResponseType,
  DeleteInvoiceBodyType,
  DeleteInvoiceResponseType,
  GetInvoiceBodyType,
  GetInvoiceResponseType,
  GetStoresResponseType,
  ListClientFilesBodyType,
  ListClientFilesResponseType,
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
export const ApiCanceledInvoice = async <
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

export const ApiDeleteInvoice = async <T extends DeleteInvoiceBodyType>({
  invoiceId,
}: T) => {
  return await httpClient.DELETE<DeleteInvoiceResponseType>(
    `/invoice/${invoiceId}`
  );
};

export const ApiCreateClientFile = async <T extends CreateClientFileBodyType>(
  body: T
) => {
  return await httpClient.POST<CreateClientFileReposeType, T>(
    "/client-files/create",
    body,
    {
      "Content-Type": "multipart/form-data",
    }
  );
};

export const ApiListClientFiles = async <T extends ListClientFilesBodyType>({
  clientId,
}: T) => {
  return await httpClient.GET<ListClientFilesResponseType>(
    `/client-files/${clientId}/list`
  );
};

export const ApiDeleteClientFile = async <T extends DeleteClientFileBodyType>({
  id,
}: T) => {
  return await httpClient.DELETE<DeleteClientFileReturnType>(
    `/client-files/${id}`
  );
};

export const ApiDeleteClient = async <T extends DeleteClientBodyType>({
  code,
}: T) => {
  return await httpClient.DELETE<DeleteClientResponseType>(
    `client/delete/${code}`
  );
};
