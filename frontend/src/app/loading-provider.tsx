import { Backdrop, CircularProgress } from '@mui/material';
import { useContext, createContext, useState } from 'react';

import { ChildrenProps } from '@/types/props/children-props';

export interface LoadingProps {
  isLoading: boolean;
  setShowLoaderHandler: (value: boolean) => void;
}

const defaultState: LoadingProps = {
  isLoading: false,
  setShowLoaderHandler: (_: boolean) => {},
};

const LoadingContext = createContext(defaultState);

const LoadingProvider = ({ children }: ChildrenProps) => {
  const [isLoading, setIsLoading] = useState(false);

  function setShowLoaderHandler(value: boolean) {
    setIsLoading(value);
  }

  const state: LoadingProps = {
    isLoading,
    setShowLoaderHandler: setShowLoaderHandler,
  };

  return (
    <LoadingContext.Provider value={state}>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1000,
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
    </LoadingContext.Provider>
  );
};
export default LoadingProvider;

export const useLoading = () => {
  return useContext(LoadingContext);
};
