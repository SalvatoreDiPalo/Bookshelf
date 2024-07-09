import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "@/routes";
import App from "@/App";
import "@/global";
import { LogtoConfig, LogtoProvider } from "@logto/react";
import { appId, endpoint } from "./utils/const";
import MenuAppBar from "./components/AppBar";

const container = document.getElementById("root") as HTMLElement;

const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: routes,
    errorElement: <div>error</div>,
  },
]);

const config: LogtoConfig = {
  endpoint: endpoint, // E.g. http://localhost:3001
  appId: appId,
};

root.render(
  <StrictMode>
    <LogtoProvider config={config}>
      <MenuAppBar />
      <RouterProvider router={router} fallbackElement={<div>loading...</div>} />
    </LogtoProvider>
  </StrictMode>,
);
