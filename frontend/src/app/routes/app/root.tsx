import {
  Backdrop,
  Box,
  CircularProgress,
  CssBaseline,
  styled,
} from '@mui/material';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';

import MenuAppBar from '@/components/ui/appbar/appbar';
import MenuDrawer from '@/components/ui/drawer/drawer';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  overflowX: 'hidden',
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginTop: 48,
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export const AppRoot = () => {
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);

  const handleDrawer = () => {
    setOpen((prevCheck) => !prevCheck);
  };

  return (
    <Suspense
      fallback={
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1000,
          }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
    >
      <ErrorBoundary
        key={location.pathname}
        fallback={<div>Something went wrong!</div>}
      >
        <Box className="flex overflow-x-hidden">
          <CssBaseline />
          <MenuAppBar open={open} handleDrawer={handleDrawer} />
          <MenuDrawer open={open} handleDrawer={handleDrawer} />
          <Main open={open}>
            <Outlet />
            <ScrollRestoration />
          </Main>
        </Box>
      </ErrorBoundary>
    </Suspense>
  );
};
