import { useHandleSignInCallback } from '@logto/react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  const { isLoading } = useHandleSignInCallback(() => {
    navigate('/home');
  });
  return isLoading ? <p>Redirecting...</p> : null;
};

export default Callback;
