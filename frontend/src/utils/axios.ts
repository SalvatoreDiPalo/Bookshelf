import axios from "axios";
import { BASE_URL, LOGTO_APPID } from "./const";

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessTokenObject: any = JSON.parse(
      localStorage.getItem(`logto:${LOGTO_APPID}:accessToken`) ?? "{}",
    );
    let token = accessTokenObject[`@${BASE_URL}`].token || "";

    config.headers.Authorization = config.headers.Authorization
      ? config.headers.Authorization
      : `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error),
);
