import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import privateRoutes from "@/routes";
import "@/global";
import { LogtoConfig, LogtoProvider } from "@logto/react";
import { createTheme, ThemeProvider } from "@mui/material";
import { indigo } from "@mui/material/colors";
import AuthProvider from "./context/AuthProvider";
import { PrivateRoutes } from "./components/PrivateRoutes";
import Notfound from "./pages/404";
import Landing from "./pages/Landing";
import Callback from "./pages/callback";
import { LOGTO_APPID, LOGTO_ENDPOINT } from "./utils/const";
import { StyledEngineProvider } from "@mui/material/styles";

const container = document.getElementById("root") as HTMLElement;

const root = createRoot(container);

const routes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
  {
    path: "/home",
    element: <PrivateRoutes />,
    children: privateRoutes,
    errorElement: <div>error</div>,
  },
  {
    path: "*",
    element: <Notfound />,
  },
];

const router = createBrowserRouter(routes);

const config: LogtoConfig = {
  endpoint: LOGTO_ENDPOINT,
  appId: LOGTO_APPID,
};
console.log("config", config);

const theme = createTheme({
  palette: {
    primary: {
      main: indigo.A200,
    },
  },
});

root.render(
  <StrictMode>
    <LogtoProvider config={config}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <StyledEngineProvider injectFirst>
            <RouterProvider
              router={router}
              fallbackElement={<div>loading...</div>}
            />
          </StyledEngineProvider>
        </AuthProvider>
      </ThemeProvider>
    </LogtoProvider>
  </StrictMode>,
);
