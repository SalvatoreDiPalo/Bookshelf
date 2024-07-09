import { lazy, Suspense } from "react";
import { type RouteObject } from "react-router-dom";

const Home = lazy(() => import("@/pages/home/index"));
const Callback = lazy(() => import("@/pages/callback/index"));

export const routes: Array<RouteObject> = [
  {
    index: true,
    element: (
      <Suspense>
        <Home />
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
];

export default routes;
