import { API } from "./axios";
import { AxiosAdapter, CreateHttpClientAdapter } from "./http-adapter";
import {
  ProfileResponseType,
  SignInBodyType,
  SignInResponseType,
  SignUpBodyType,
  SignUpResponseType,
  UpdateAvatarProfileBodyType,
  UpdateAvatarProfileResponseType,
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
