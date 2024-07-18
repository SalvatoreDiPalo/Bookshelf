import { UserDTO } from "@/models/UserDTO";
import { AxiosInterceptor } from "@/utils/axios";
import { BASE_URL } from "@/utils/const";
import { useLogto } from "@logto/react";
import {
  Backdrop,
  CircularProgress,
  createTheme,
  PaletteMode,
  ThemeProvider,
} from "@mui/material";
import { indigo } from "@mui/material/colors";
import axios from "axios";
import { useContext, createContext, useState, useEffect, useMemo } from "react";

export enum AuthStatus {
  Loading,
  SignedIn,
  SignedOut,
}

export interface IAuth {
  authStatus?: AuthStatus;
  user?: UserDTO;
  token?: string;
  setShowLoaderHandler: (value: boolean) => void;
  signIn?: () => void;
  signOut?: () => void;
  updateTheme?: () => void;
}

const defaultState: IAuth = {
  authStatus: AuthStatus.Loading,
  setShowLoaderHandler: (value: boolean) => {},
};

type Props = {
  children?: React.ReactNode;
};

const AuthContext = createContext(defaultState);

const AppProvider = ({ children }: Props) => {
  const { isAuthenticated, getAccessToken } = useLogto();
  const [authStatus, setAuthStatus] = useState(AuthStatus.Loading);
  const [user, setUser] = useState<UserDTO>();
  const [showLoading, setShowLoading] = useState(false);
  const [theme, setTheme] = useState<PaletteMode>(() => {
    let initialTheme = localStorage.getItem("theme");
    initialTheme = initialTheme ? initialTheme : "light";
    return initialTheme as PaletteMode;
  });

  const themeObject = useMemo(() => {
    const secondBackground = theme == "light" ? "#F4F5F9" : "#272727";
    return createTheme({
      palette: {
        mode: theme,
        primary: {
          main: indigo.A200,
          secondBackground: secondBackground,
        },
      },
      components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: theme == "light" ? "#fff" : "#000",
              color: indigo.A200,
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: secondBackground,
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            root: {
              backgroundColor: secondBackground,
            },
          },
        },
      },
    });
  }, [theme]);

  function setShowLoaderHandler(value: boolean) {
    setShowLoading(value);
  }

  function getThemeFromLocalStorage() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme as PaletteMode);
    }
  }

  function toggleTheme() {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  }

  useEffect(() => {
    getThemeFromLocalStorage();
  }, [theme]);

  useEffect(() => {
    const getWhoAmI = async () => {
      try {
        let token = await getAccessToken(BASE_URL);
        const response = await axios<UserDTO>(`/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setAuthStatus(AuthStatus.SignedIn);
      } catch (e) {
        console.error("Error in auth provider", e);
        setAuthStatus(AuthStatus.SignedOut);
      }
    };
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
    updateTheme: toggleTheme,
    setShowLoaderHandler: setShowLoaderHandler,
  };

  if (authStatus === AuthStatus.Loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={state}>
      <ThemeProvider theme={themeObject}>
        <AxiosInterceptor>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {children}
        </AxiosInterceptor>
      </ThemeProvider>
    </AuthContext.Provider>
  );
};
export default AppProvider;

export const useAppContext = () => {
  return useContext(AuthContext);
};
