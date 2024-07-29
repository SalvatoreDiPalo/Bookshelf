import { AuthStatus, useAppContext } from '@/app/main-provider';
import { Navigate, useLocation } from 'react-router-dom';

export const PrivateRoutes = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { authStatus, user } = useAppContext();

  if (authStatus === AuthStatus.Loading) {
    return null; // or loading indicator/spinner/etc
  }

  return authStatus == AuthStatus.SignedIn ? (
    children
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};
