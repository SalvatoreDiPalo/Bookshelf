import { AuthStatus, useAppContext } from "@/context/AppProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const PrivateRoutes = () => {
  const location = useLocation();
  const { authStatus, user } = useAppContext();

  console.log("PrivateRoutes with authStatus: ", authStatus);
  if (authStatus === AuthStatus.Loading) {
    console.log("PrivateRoutes authStatus == Loading -> return null");
    return null; // or loading indicator/spinner/etc
  }

  return authStatus == AuthStatus.SignedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};
