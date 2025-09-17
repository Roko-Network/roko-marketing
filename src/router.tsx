import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
// Route configuration types
interface RouteConfig {
  path: string;
  element: React.ReactElement;
  errorElement?: React.ReactElement;
  label?: string;
  description?: string;
  featured?: boolean;
}

// Layout components
import RootLayout from './components/templates/RootLayout';
import ErrorBoundary from './components/organisms/ErrorBoundary';
import LoadingSpinner from './components/atoms/LoadingSpinner';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@pages/Home/HomePage'));
const TechnologyPage = lazy(() => import('@pages/Technology/TechnologyPage'));
const GovernancePage = lazy(() => import('@pages/Governance/GovernancePage'));
const DevelopersPage = lazy(() => import('@pages/Developers/DevelopersPage'));
const EcosystemPage = lazy(() => import('@pages/Ecosystem/EcosystemPage'));


// 404 and error pages
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));

// Wrapper component for lazy-loaded routes with error boundaries
const LazyPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner size="lg" />
      </div>
    }>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Route configuration for easy management - keeping only home
export const routeConfig: RouteConfig[] = [
  {
    path: '/',
    element: <HomePage />,
    label: 'Home',
    description: 'ROKO Network - The Temporal Layer for Web3'
  }
];

// Create router configuration with enhanced performance
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <LazyPageWrapper>
        <NotFoundPage />
      </LazyPageWrapper>
    ),
    children: [
      // Home route
      {
        index: true,
        element: (
          <LazyPageWrapper>
            <HomePage />
          </LazyPageWrapper>
        )
      },
      // No additional main navigation routes - home only
      // No sub-routes needed
      // Redirects for legacy routes - all redirect to home
      {
        path: 'home',
        element: <Navigate to="/" replace />
      },
      {
        path: 'tech',
        element: <Navigate to="/" replace />
      },
      {
        path: 'technology',
        element: <Navigate to="/" replace />
      },
      {
        path: 'governance',
        element: <Navigate to="/" replace />
      },
      {
        path: 'developers',
        element: <Navigate to="/" replace />
      },
      {
        path: 'ecosystem',
        element: <Navigate to="/" replace />
      },
      {
        path: 'dev',
        element: <Navigate to="/" replace />
      },
      {
        path: 'docs',
        element: <Navigate to="/" replace />
      },
    ]
  },
  // Catch-all route for 404
  {
    path: '*',
    element: (
      <LazyPageWrapper>
        <NotFoundPage />
      </LazyPageWrapper>
    )
  }
]);

// Router Provider component
export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

// Utility functions for navigation
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return routeConfig.find(route => route.path === path);
};

export const getFeaturedRoutes = (): RouteConfig[] => {
  return routeConfig.filter(route => route.featured);
};

export const getMainNavigationRoutes = (): RouteConfig[] => {
  return []; // No navigation routes - home only
};

// Export types
export type { RouteConfig };
export default AppRouter;