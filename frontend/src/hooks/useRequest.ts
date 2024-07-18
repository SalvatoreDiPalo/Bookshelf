import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useLogto } from "@logto/react";
import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "@/context/AppProvider";
import { BASE_URL } from "@/utils/const";

const client = axios.create({
  baseURL: `${BASE_URL}/API`,
});

export const useRequest = <T>(
  initialOptions: AxiosRequestConfig,
  shouldFetchOnMount: boolean = true,
) => {
  const { getAccessToken } = useLogto();
  const { token } = useAppContext();
  const [data, setData] = useState<T>();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [refetch, setRefetch] = useState(initialOptions);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let headerToken = "Bearer ";
      if (!token || token === "") {
        const apiToken = await getAccessToken(BASE_URL);
        headerToken += apiToken;
      } else {
        headerToken += token;
      }
      // Set the authorization header
      headerToken !== "" &&
        (client.defaults.headers.common.Authorization = headerToken);
      const response: AxiosResponse = await client(refetch);
      setData(response?.data);
    } catch (error: any) {
      setError(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  }, [refetch]);

  useEffect(() => {
    if (shouldFetchOnMount) {
      fetchData();
    }
  }, [fetchData, shouldFetchOnMount]);

  return { data, error, isLoading, setRefetch, fetchData };
};
