import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import privateRoutes from "@/routes";
import "@/global";
import { LogtoConfig, LogtoProvider } from "@logto/react";
import { appId, endpoint } from "./utils/const";
import { createTheme, ThemeProvider } from "@mui/material";
import { indigo } from "@mui/material/colors";
import AuthProvider from "./context/AuthProvider";
import { PrivateRoutes } from "./components/PrivateRoutes";
import Notfound from "./pages/404";
import Landing from "./pages/Landing";
import Callback from "./pages/callback";

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
  endpoint: endpoint, // E.g. http://localhost:3001
  appId: appId,
};

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
          <RouterProvider
            router={router}
            fallbackElement={<div>loading...</div>}
          />
        </AuthProvider>
      </ThemeProvider>
    </LogtoProvider>
  </StrictMode>,
);
