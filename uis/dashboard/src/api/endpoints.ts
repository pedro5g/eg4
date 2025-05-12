import { API } from "./axios";
import { AxiosAdapter, CreateHttpClientAdapter } from "./http-adapter";
import {
  ClientProfileResponseType,
  CreateStoreBodyType,
  CreateStoreResponseType,
  GetStoresResponseType,
  ListClientsBodyType,
  ListClientsResponseType,
  LogoutResponseType,
  ProfileResponseType,
  RegisterClientBodyType,
  RegisterClientResponseType,
  SignInBodyType,
  SignInResponseType,
  SignUpBodyType,
  SignUpResponseType,
  SummaryResponseType,
  UpdateAvatarProfileBodyType,
  UpdateAvatarProfileResponseType,
  UpdateClienteProfileBodyType,
  UpdateClientProfileResponseType,
  UpdateProfileBodyType,
  UpdateProfileResponseType,
} from "./types";

const axiosAdapter = AxiosAdapter(API);
const httpClient = CreateHttpClientAdapter(axiosAdapter);

export const ApiSignUp = async <T = SignUpBodyType>(body: T) => {
  return await httpClient.POST<SignUpResponseType, T>("/auth/register", body);
};

export const ApiSignIn = async <T = SignInBodyType>(body: T) => {
  return await httpClient.POST<SignInResponseType, T>("/auth/login", body);
};

export const ApiProfile = async () => {
  return await httpClient.GET<ProfileResponseType>("/user/profile");
};

export const ApiUpdateAvatarProfile = async <T = UpdateAvatarProfileBodyType>(
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

export const ApiUpdateProfile = async <T = UpdateProfileBodyType>(body: T) => {
  return await httpClient.PATCH<UpdateProfileResponseType, T>(
    "/user/update/profile",
    body
  );
};

export const ApiLogout = async () => {
  return await httpClient.GET<LogoutResponseType>("/auth/logout");
};

export const ApiCreateStore = async <T = CreateStoreBodyType>(body: T) => {
  return await httpClient.POST<CreateStoreResponseType, T>(
    "/store/register",
    body
  );
};

export const ApiListStores = async () => {
  return await httpClient.GET<GetStoresResponseType>("/store/list");
};

export const ApiRegisterClient = async <T = RegisterClientBodyType>(
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

export const ApiUpdateClientProfile = async <T = UpdateClienteProfileBodyType>(
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
