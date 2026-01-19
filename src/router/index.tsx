import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Lazy load pages
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminRestaurants = lazy(() => import('../pages/admin/AdminRestaurants'));
const AdminGuests = lazy(() => import('../pages/admin/AdminGuests'));
const AdminBilling = lazy(() => import('../pages/admin/AdminBilling'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'));

// Loading Fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-neutral-600">Loading...</p>
    </div>
  </div>
);

const withSuspense = (Component: React.ComponentType<any>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/register',
    element: withSuspense(RegisterPage),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        {withSuspense(DashboardPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute requiredRole="admin">
        {withSuspense(AdminDashboard)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/restaurants',
    element: (
      <ProtectedRoute requiredRole="admin">
        {withSuspense(AdminRestaurants)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/guests',
    element: (
      <ProtectedRoute requiredRole="admin">
        {withSuspense(AdminGuests)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/billing',
    element: (
      <ProtectedRoute requiredRole="admin">
        {withSuspense(AdminBilling)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/analytics',
    element: (
      <ProtectedRoute requiredRole="admin">
        {withSuspense(AdminAnalytics)}
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
