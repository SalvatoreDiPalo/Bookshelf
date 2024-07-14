import { lazy, Suspense } from "react";
import { type RouteObject } from "react-router-dom";
import App from "./App";

const Home = lazy(() => import("@/pages/home/index"));
const Profile = lazy(() => import("@/pages/profile/index"));
const Callback = lazy(() => import("@/pages/callback/index"));
const Settings = lazy(() => import("@/pages/settings/index"));

export const privateRoutes: Array<RouteObject> = [
  {
    path: "/home",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/home/profile",
        element: (
          <Suspense>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "/home/settings",
        element: (
          <Suspense>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense>
            <Callback />
          </Suspense>
        ),
      },
    ],
    errorElement: <div>error</div>,
  },
];

export default privateRoutes;
