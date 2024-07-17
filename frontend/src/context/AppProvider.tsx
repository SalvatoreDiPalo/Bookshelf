import { UserDTO } from "@/models/UserDTO";
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
  signIn?: () => void;
  signOut?: () => void;
  updateTheme?: () => void;
  updateLoading?: () => void;
}

const defaultState: IAuth = {
  authStatus: AuthStatus.Loading,
};

type Props = {
  children?: React.ReactNode;
};

const AuthContext = createContext(defaultState);

const AppProvider = ({ children }: Props) => {
  const { isAuthenticated, getAccessToken } = useLogto();
  const [authStatus, setAuthStatus] = useState(AuthStatus.Loading);
  const [user, setUser] = useState<UserDTO>();
  const [open, setOpen] = useState(false);
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

  const handleLoading = () => {
    setOpen((prevValue) => !prevValue);
  };

  const state: IAuth = {
    authStatus,
    user,
    signIn,
    signOut,
    updateTheme: toggleTheme,
    updateLoading: handleLoading,
  };

  if (authStatus === AuthStatus.Loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={state}>
      <ThemeProvider theme={themeObject}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {children}
      </ThemeProvider>
    </AuthContext.Provider>
  );
};
export default AppProvider;

export const useAppContext = () => {
  return useContext(AuthContext);
};
