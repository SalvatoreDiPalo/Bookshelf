import { useLogto } from '@logto/react';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { useEffect, useState } from 'react';

import { ChildrenProps } from '@/types/props/children-props';
import { axiosInstance } from '@/utils/axios';
import { env } from '@/utils/env';
import { getToken } from '@/utils/helpers';

import { useLoading } from './loading-provider';

interface RequestConfig extends AxiosRequestConfig {
  reqIdx?: number;
}

export const InterceptorProvider = ({ children }: ChildrenProps) => {
  const { getAccessToken, signOut } = useLogto();
  const [isLoaded, setIsLoaded] = useState(false);
  const { setShowLoaderHandler } = useLoading();

  let isRefreshing = false;
  const refreshSubscribers: ((token: string) => void)[] = [];
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
      console.log('Remove request', req);
      requestsCount = requestsCount.filter((arr) => arr.reqIdx !== req.reqIdx);
      if (!requestsCount.length) setShowLoaderHandler(false);
    }, 500);
  };

  const addRequest = (config: RequestConfig) => {
    console.log('addRequest', config);
    requestsIndex = requestsIndex + 1;
    config['reqIdx'] = requestsIndex;
    requestsCount.push(config);
  };

  const onRequest = (
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig => {
    console.log('onRequest', config, 'Richiama addRequest');
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
    console.log('onRequestError', error, 'Richiama removeRequest');
    removeRequest(error.config!);
    return Promise.reject(error.config);
  };

  const onResponse = (response: AxiosResponse): AxiosResponse => {
    console.log('onResponse', response, 'Richiama removeRequest');
    removeRequest(response.config);
    return response;
  };

  const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    console.log('onResponseError', error, 'Richiama removeRequest');
    removeRequest(error.config!);
    // prettier-ignore
    const { config,  response } = error;
    const status = response?.status;
    const originalRequest = config;

    if (
      (status === 401 || status === 498) &&
      !config?.url?.includes(env.LOGTO_ENDPOINT)
    ) {
      console.log('If in onResponseError');
      if (!isRefreshing) {
        console.log('!isRefreshing');
        isRefreshing = true;
        getAccessToken(env.API_URL)
          .then((tk) => {
            isRefreshing = false;
            onRrefreshed(tk!);
          })
          .catch(() => {
            isRefreshing = false;
            logout();
          });
      }
      const retryOrigReq = new Promise<AxiosResponse>((resolve, _) => {
        console.log('!retryOrigReq');
        subscribeTokenRefresh((token) => {
          console.log('subscribeTokenRefresh', token);
          // replace the expired token and retry
          originalRequest!.headers['Authorization'] = `Bearer ${token}`;
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
