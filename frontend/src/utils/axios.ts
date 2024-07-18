import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL, LOGTO_ENDPOINT } from "./const";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppProvider";
import { useLogto } from "@logto/react";
import { getToken } from "./helpers";

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
});

type Props = {
  children?: React.ReactNode;
};

interface RequestConfig extends AxiosRequestConfig {
  reqIdx?: number;
}

export const AxiosInterceptor = ({ children }: Props) => {
  const { getAccessToken, signOut } = useLogto();
  const [isLoaded, setIsLoaded] = useState(false);
  const { setShowLoaderHandler } = useAppContext();

  let isRefreshing = false;
  let refreshSubscribers: ((token: string) => void)[] = [];
  let requestsCount: RequestConfig[] = [];
  let requestsIndex = 0;

  const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
  };

  const onRrefreshed = (token: string) => {
    refreshSubscribers.map((cb) => cb(token));
  };

  const logout = () => {
    signOut();
  };

  const removeRequest = (req: RequestConfig) => {
    setTimeout(() => {
      requestsCount = requestsCount.filter((arr) => arr.reqIdx !== req.reqIdx);
      if (!requestsCount.length) setShowLoaderHandler(false);
    }, 500);
  };

  const addRequest = (config: RequestConfig) => {
    requestsIndex = requestsIndex + 1;
    config["reqIdx"] = requestsIndex;
    requestsCount.push(config);
  };

  const onRequest = (
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig => {
    setShowLoaderHandler(true);
    addRequest(config);
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = config.headers.Authorization
        ? config.headers.Authorization
        : `Bearer ${token}`;
    }
    return config;
  };

  const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    removeRequest(error.config!);
    return Promise.reject(error.config);
  };

  const onResponse = (response: AxiosResponse): AxiosResponse => {
    removeRequest(response.config);
    return response;
  };

  const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    removeRequest(error.config!);
    // prettier-ignore
    const { config,  response } = error;
    const status = response?.status;
    const originalRequest = config;

    if (
      (status === 401 || status === 498) &&
      !config?.url?.includes(LOGTO_ENDPOINT)
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        getAccessToken(BASE_URL)
          .then((tk) => {
            isRefreshing = false;
            onRrefreshed(tk!);
          })
          .catch(() => {
            isRefreshing = false;
            logout();
          });
      }
      const retryOrigReq = new Promise<AxiosResponse>((resolve, reject) => {
        subscribeTokenRefresh((token) => {
          // replace the expired token and retry
          originalRequest!.headers["Authorization"] = `Bearer ${token}`;
          resolve(axios(originalRequest!));
        });
      });
      console.clear();
      return retryOrigReq.then((response) => response.data);
    } else {
      return Promise.reject(error.response);
    }
  };

  useEffect(() => {
    const reqInterceptorEject = axiosInstance.interceptors.request.use(
      onRequest,
      onRequestError,
    );
    const resInterceptorEject = axiosInstance.interceptors.response.use(
      onResponse,
      onResponseError,
    );
    setIsLoaded(true);
    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptorEject);
      axiosInstance.interceptors.response.eject(resInterceptorEject);
    };
  }, []);

  return isLoaded ? children : null;
};
