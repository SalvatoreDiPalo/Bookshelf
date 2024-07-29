import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import '@/global';
import { LogtoConfig, LogtoProvider } from '@logto/react';
import AppProvider from './main-provider';
import { LOGTO_APPID, LOGTO_ENDPOINT } from '../utils/const';
import { StyledEngineProvider } from '@mui/material/styles';
import { router } from './routes';

const container = document.getElementById('root') as HTMLElement;

const root = createRoot(container);

const config: LogtoConfig = {
  endpoint: LOGTO_ENDPOINT,
  appId: LOGTO_APPID,
};

root.render(
  <StrictMode>
    <LogtoProvider config={config}>
      <AppProvider>
        <StyledEngineProvider injectFirst>
          <RouterProvider
            router={router}
            fallbackElement={<div>loading...</div>}
          />
        </StyledEngineProvider>
      </AppProvider>
    </LogtoProvider>
  </StrictMode>,
);
