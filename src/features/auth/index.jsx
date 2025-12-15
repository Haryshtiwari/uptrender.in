import { lazy, Suspense } from 'react';
import ResetPage from './pages/ResetPage';
import AdminTwoSteps from './pages/AdminTwoSteps';

// Lazy load auth pages
const Login = lazy(() => import('../auth/pages/Login'));
const AdminLogin = lazy(() => import('../auth/pages/AdminLogin'));
const Register = lazy(() => import('../auth/pages/Register'));
const ForgotPassword = lazy(() => import('../auth/pages/ForgotPassword'));
const AdminForgotPassword= lazy(() => import('../auth/pages/AdminForgotPassword'));
const TwoSteps = lazy(() => import('../auth/pages/TwoSteps'));

const Loader = () => <div>Loading...</div>; // You can replace this with a spinner

const AuthRoutes = [
  {
    path: 'login',
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
  },
   {
    path: 'admin-login',
    element: (
      <Suspense fallback={<Loader />}>
        <AdminLogin />
      </Suspense>
    ),
  },
  {
    path: 'register',
    element: (
      <Suspense fallback={<Loader />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: 'forgot-password',
    element: (
      <Suspense fallback={<Loader />}>
        <ForgotPassword />
      </Suspense>
    ),
  },
    {
    path: 'admin-forgot-password',
    element: (
      <Suspense fallback={<Loader />}>
        <AdminForgotPassword />
      </Suspense>
    ),
  },
      {
    path: 'reset-password',
    element: (
      <Suspense fallback={<Loader />}>
        <ResetPage />
      </Suspense>
    ),
  },
  {
    path: 'two-steps',
    element: (
      <Suspense fallback={<Loader />}>
        <TwoSteps />
      </Suspense>
    ),
  },
   {
    path: 'admin-twosteps',
    element: (
      <Suspense fallback={<Loader />}>
        <AdminTwoSteps />
      </Suspense>
    ),
  },
];

export default AuthRoutes;
