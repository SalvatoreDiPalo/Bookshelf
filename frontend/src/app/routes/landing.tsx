import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { useLogto } from '@logto/react';
import { baseUrl, redirectUrl } from '@/utils/const';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, signIn, signOut } = useLogto();
  return (
    <>
      <AppBar position="fixed" className="shadow-none">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Persistent drawer
          </Typography>
          {!isAuthenticated ? (
            <>
              <Button
                color="inherit"
                onClick={() => {
                  void signIn({
                    redirectUri: redirectUrl,
                    interactionMode: 'signUp',
                  });
                }}
              >
                Sign Up
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  void signIn(redirectUrl);
                }}
              >
                Login
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => {
                  navigate('/home');
                }}
              >
                Profile
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  void signOut(baseUrl);
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
