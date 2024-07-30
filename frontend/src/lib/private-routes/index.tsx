import { Navigate, useLocation } from 'react-router-dom';

import { AuthStatus, useAuth } from '@/app/main-provider';

export const PrivateRoutes = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { authStatus } = useAuth();

  if (authStatus === AuthStatus.Loading) {
    return null; // or loading indicator/spinner/etc
  }

  return authStatus == AuthStatus.SignedIn ? (
    children
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};
