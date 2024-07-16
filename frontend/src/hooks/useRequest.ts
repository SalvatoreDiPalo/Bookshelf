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
    console.log("fetchData");
    try {
      let headerToken = "Bearer ";
      if (!token || token === "") {
        console.log("Fetching token inside useRequest");
        const apiToken = await getAccessToken(BASE_URL);
        headerToken += apiToken;
      } else {
        headerToken += token;
      }
      console.log("Token", headerToken);
      // Set the authorization header
      headerToken !== "" &&
        (client.defaults.headers.common.Authorization = headerToken);
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
