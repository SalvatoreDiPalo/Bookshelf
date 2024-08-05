import { env } from '@/utils/env';
import { useHandleSignInCallback, useLogto } from '@logto/react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();
  const { getAccessToken } = useLogto();

  const { isLoading } = useHandleSignInCallback(() => {
    getAccessToken(env.API_URL).then(() => navigate('/home'));
  });
  return isLoading ? <p>Redirecting...</p> : null;
};

export default Callback;
