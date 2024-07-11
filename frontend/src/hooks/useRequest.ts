import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useLogto } from "@logto/react";
import { useCallback, useEffect, useState } from "react";

const client = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const useRequest = <T>(
  initialOptions: AxiosRequestConfig,
  shouldFetchOnMount: boolean = true,
) => {
  const { getAccessToken } = useLogto();
  const [data, setData] = useState<T>();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [refetch, setRefetch] = useState(initialOptions);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    console.log("fetchData");
    try {
      let token = await getAccessToken("http://localhost:3001");
      console.log("Token", token);
      // Set the authorization header
      token !== "" &&
        (client.defaults.headers.common.Authorization = `Bearer ${token}`);
      const response: AxiosResponse = await client(refetch);
      console.log("Response", refetch, response);
      setData(response?.data);
    } catch (error: any) {
      console.error("Error in useRequest", error);
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
