import { useAppContext } from '@/app/main-provider';
import { useHandleSignInCallback } from '@logto/react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();
  const { signIn } = useAppContext();

  const { isLoading } = useHandleSignInCallback(() => {
    //fetchData();
    signIn!();
    navigate('/home');
  });
  return isLoading ? <p>Redirecting...</p> : null;
};

export default Callback;
