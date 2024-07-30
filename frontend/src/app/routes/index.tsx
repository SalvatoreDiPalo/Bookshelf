import Landing from './landing';
import { lazy } from 'react';
import Notfound from './not-found';
import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoutes } from '@/lib/private-routes';
import { AppRoot } from './app/root';

const Books = lazy(() => import('@/app/routes/app/books/books'));
const Profile = lazy(() => import('@/app/routes/app/profile/profile'));
const Callback = lazy(() => import('@/app/routes/callback'));
const Settings = lazy(() => import('@/app/routes/app/settings/settings'));

const routes = [
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/callback',
    element: <Callback />,
  },
  {
    path: '/home',
    element: (
      <PrivateRoutes>
        <AppRoot />
      </PrivateRoutes>
    ),
    children: [
      {
        path: '/home',
        children: [
          {
            index: true,
            element: <Books />,
          },
          {
            path: '/home/profile',
            element: <Profile />,
          },
          {
            path: '/home/settings',
            element: <Settings />,
          },
          {
            path: '*',
            element: <Callback />,
          },
        ],
        errorElement: <div>error</div>,
      },
    ],
    errorElement: <div>error</div>,
  },
  {
    path: '*',
    element: <Notfound />,
  },
];

export const router = createBrowserRouter(routes);
