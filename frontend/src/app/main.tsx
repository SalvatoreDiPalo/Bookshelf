import { LogtoConfig, LogtoProvider } from '@logto/react';
import { StyledEngineProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider } from 'react-router-dom';
import '@/global';

import { MainErrorFallback } from '@/components/errors/main';
import { env } from '@/utils/env';

import { InterceptorProvider } from './interceptor-provider';
import LoadingProvider from './loading-provider';
import AppProvider from './main-provider';
import { router } from './routes';
import BookThemeProvider from './theme-provider';

const container = document.getElementById('root') as HTMLElement;

const root = createRoot(container);

const config: LogtoConfig = {
  endpoint: env.LOGTO_ENDPOINT,
  appId: env.LOGTO_APPID,
  resources: [env.API_URL],
};

root.render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <LogtoProvider config={config}>
        <LoadingProvider>
          <InterceptorProvider>
            <AppProvider>
              <BookThemeProvider>
                <StyledEngineProvider injectFirst>
                  <RouterProvider
                    router={router}
                    fallbackElement={<div>loading...</div>}
                  />
                </StyledEngineProvider>
              </BookThemeProvider>
            </AppProvider>
          </InterceptorProvider>
        </LoadingProvider>
      </LogtoProvider>
    </ErrorBoundary>
  </StrictMode>,
);
