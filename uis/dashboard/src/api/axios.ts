import axios, { CreateAxiosDefaults } from "axios";

const options: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

const APIRefresh = axios.create(options);
APIRefresh.interceptors.response.use((response) => {
  return response;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error?.response || {};

    if (
      (data.errorCode === "AUTH_TOKEN_NOT_FOUND" ||
        data.errorCode === "AUTH_INVALID_TOKEN") &&
      status === 401
    ) {
      try {
        await APIRefresh.get("/auth/refresh");
        return APIRefresh(error.config);
      } catch (error) {
        if (typeof window !== "undefined") window.location.href = "/sign-in";
      }
    }
    return Promise.reject({
      ...data,
    });
  }
);
export { API };
