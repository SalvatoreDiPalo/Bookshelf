import { UserDTO } from "@/models/UserDTO";
import { useLogto } from "@logto/react";
import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";

export enum AuthStatus {
  Loading,
  SignedIn,
  SignedOut,
}

export interface IAuth {
  authStatus?: AuthStatus;
  user?: UserDTO;
  signIn?: () => void;
  signOut?: () => void;
}

const defaultState: IAuth = {
  authStatus: AuthStatus.Loading,
};

type Props = {
  children?: React.ReactNode;
};

const AuthContext = createContext(defaultState);

const AuthProvider = ({ children }: Props) => {
  const { isAuthenticated, getAccessToken } = useLogto();
  const [authStatus, setAuthStatus] = useState(AuthStatus.Loading);
  const [user, setUser] = useState<UserDTO>();

  useEffect(() => {
    const getWhoAmI = async () => {
      try {
        let token = await getAccessToken("http://localhost:3001");
        const response = await axios<UserDTO>(
          "http://localhost:3001/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("User", response.data);
        setUser(response.data);
        setAuthStatus(AuthStatus.SignedIn);
      } catch (e) {
        console.error("Error in auth provider", e);
        setAuthStatus(AuthStatus.SignedOut);
      }
    };
    console.log(
      "AuthProvider: useEffect. isAuthenticated: ",
      isAuthenticated,
      "AuthStatus: ",
      authStatus,
    );
    setAuthStatus(AuthStatus.Loading);
    if (isAuthenticated) {
      getWhoAmI();
    } else {
      setAuthStatus(AuthStatus.SignedOut);
    }
  }, [isAuthenticated]);

  function signIn() {
    setAuthStatus(AuthStatus.SignedIn);
  }

  function signOut() {
    setAuthStatus(AuthStatus.SignedOut);
  }

  const state: IAuth = {
    authStatus,
    user,
    signIn,
    signOut,
  };

  if (authStatus === AuthStatus.Loading) {
    return null;
  }

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
