import { AccessTokenClaims, useLogto } from '@logto/react';
import { useContext, createContext, useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import { ChildrenProps } from '@/types/props/children-props';
import { env } from '@/utils/env';

export enum AuthStatus {
  Loading,
  SignedIn,
  SignedOut,
}

export interface IAuth {
  authStatus: AuthStatus;
  user?: AccessTokenClaims;
  token?: string;
  shouldReloadComponent?: string;
  shouldReload?: () => void;
}

const defaultState: IAuth = {
  authStatus: AuthStatus.Loading,
};

const AuthContext = createContext(defaultState);

const AuthProvider = ({ children }: ChildrenProps) => {
  const { isAuthenticated, getAccessTokenClaims } = useLogto();
  const [authStatus, setAuthStatus] = useState(AuthStatus.Loading);
  const [user, setUser] = useState<AccessTokenClaims>();
  const [shouldReloadComponent, setShouldReloadComponent] = useState<string>();

  useEffect(() => {
    const getWhoAmI = async () => {
      try {
        const response = await getAccessTokenClaims(env.API_URL);
        setUser(response);
        setAuthStatus(AuthStatus.SignedIn);
      } catch (e) {
        console.error('Error in auth provider', e);
        setAuthStatus(AuthStatus.SignedOut);
      }
    };
    if (isAuthenticated) {
      getWhoAmI();
    } else {
      setAuthStatus(AuthStatus.SignedOut);
    }
  }, [isAuthenticated]);

  function shouldReload() {
    const random = window.crypto.randomUUID();
    console.log('Should reload called', random);
    setShouldReloadComponent(random);
  }

  const state: IAuth = {
    authStatus,
    user,
    shouldReloadComponent,
    shouldReload,
  };

  if (authStatus === AuthStatus.Loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={state}>
      <HelmetProvider>{children}</HelmetProvider>
    </AuthContext.Provider>
  );
};
export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
