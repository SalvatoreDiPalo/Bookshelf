import Landing from './landing';
import { lazy, Suspense } from 'react';
import Notfound from './not-found';
import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoutes } from '@/lib/private-routes';
import { AppRoot } from './app/root';
import Books from './app/books/books';

const Home = lazy(() => import('@/pages/home/index'));
const Profile = lazy(() => import('@/pages/profile/index'));
const Callback = lazy(() => import('@/pages/callback/index'));
const Settings = lazy(() => import('@/pages/settings/index'));

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
