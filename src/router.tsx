import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import type { RouteConfig } from '@types';

// Layout components
import RootLayout from '@components/templates/RootLayout';
import ErrorBoundary from '@components/organisms/ErrorBoundary';
import LoadingSpinner from '@components/atoms/LoadingSpinner';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@pages/Home/HomePage'));
const TechnologyPage = lazy(() => import('@pages/Technology/TechnologyPage'));
const GovernancePage = lazy(() => import('@pages/Governance/GovernancePage'));
const DevelopersPage = lazy(() => import('@pages/Developers/DevelopersPage'));
const EcosystemPage = lazy(() => import('@pages/Ecosystem/EcosystemPage'));

// Company pages
const AboutPage = lazy(() => import('@pages/Company/AboutPage'));
const CareersPage = lazy(() => import('@pages/Company/CareersPage'));
const PressPage = lazy(() => import('@pages/Company/PressPage'));
const LegalPage = lazy(() => import('@pages/Company/LegalPage'));
const ContactPage = lazy(() => import('@pages/Company/ContactPage'));

// 404 and error pages
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));

// Wrapper component for lazy-loaded routes with error boundaries
const LazyPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
        <LoadingSpinner size="lg" />
      </div>
    }>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Route configuration for easy management
export const routeConfig: RouteConfig[] = [
  {
    path: '/',
    element: HomePage,
    label: 'Home',
    description: 'ROKO Network - The Temporal Layer for Web3'
  },
  {
    path: '/technology',
    element: TechnologyPage,
    label: 'Technology',
    description: 'Temporal blockchain infrastructure with nanosecond precision',
    featured: true
  },
  {
    path: '/governance',
    element: GovernancePage,
    label: 'Governance',
    description: 'Decentralized decision making and proposal system',
    featured: true
  },
  {
    path: '/developers',
    element: DevelopersPage,
    label: 'Developers',
    description: 'Build time-sensitive dApps on ROKO Network',
    featured: true
  },
  {
    path: '/ecosystem',
    element: EcosystemPage,
    label: 'Ecosystem',
    description: 'Partners, integrations, and community projects',
    featured: true
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
      // Main navigation routes
      {
        path: 'technology',
        element: (
          <LazyPageWrapper>
            <TechnologyPage />
          </LazyPageWrapper>
        )
      },
      {
        path: 'governance',
        element: (
          <LazyPageWrapper>
            <GovernancePage />
          </LazyPageWrapper>
        )
      },
      {
        path: 'developers',
        element: (
          <LazyPageWrapper>
            <DevelopersPage />
          </LazyPageWrapper>
        )
      },
      {
        path: 'ecosystem',
        element: (
          <LazyPageWrapper>
            <EcosystemPage />
          </LazyPageWrapper>
        )
      },
      // Technology sub-routes
      {
        path: 'technology/temporal-layer',
        element: (
          <LazyPageWrapper>
            <TechnologyPage section="temporal-layer" />
          </LazyPageWrapper>
        )
      },
      {
        path: 'technology/consensus',
        element: (
          <LazyPageWrapper>
            <TechnologyPage section="consensus" />
          </LazyPageWrapper>
        )
      },
      {
        path: 'technology/architecture',
        element: (
          <LazyPageWrapper>
            <TechnologyPage section="architecture" />
          </LazyPageWrapper>
        )
      },
      {
        path: 'technology/security',
        element: (
          <LazyPageWrapper>
            <TechnologyPage section="security" />
          </LazyPageWrapper>
        )
      },
      // Developers sub-routes
      {
        path: 'developers/docs',
        element: (
          <LazyPageWrapper>
            <DevelopersPage section="docs" />
          </LazyPageWrapper>
        )
      },
      {
        path: 'developers/api',
        element: (
          <LazyPageWrapper>
            <DevelopersPage section="api" />
          </LazyPageWrapper>
        )
      },
      {
        path: 'developers/sdks',
        element: (
          <LazyPageWrapper>
            <DevelopersPage section="sdks" />
          </LazyPageWrapper>
        )
      },
      {
        path: 'developers/tutorials',
        element: (
          <LazyPageWrapper>
            <DevelopersPage section="tutorials" />
          </LazyPageWrapper>
        )
      },
      // Governance sub-routes
      {
        path: 'governance/proposals',
        element: (
          <LazyPageWrapper>
            <GovernancePage section="proposals" />
          </LazyPageWrapper>
        )
      },
      {
        path: 'governance/voting',
        element: (
          <LazyPageWrapper>
            <GovernancePage section="voting" />
          </LazyPageWrapper>
        )
      },
      {
        path: 'governance/validators',
        element: (
          <LazyPageWrapper>
            <GovernancePage section="validators" />
          </LazyPageWrapper>
        )
      },
      // Ecosystem sub-routes
      {
        path: 'ecosystem/partners',
        element: (
          <LazyPageWrapper>
            <EcosystemPage section="partners" />
          </LazyPageWrapper>
        )
      },
      {
        path: 'ecosystem/integrations',
        element: (
          <LazyPageWrapper>
            <EcosystemPage section="integrations" />
          </LazyPageWrapper>
        )
      },
      {
        path: 'ecosystem/community',
        element: (
          <LazyPageWrapper>
            <EcosystemPage section="community" />
          </LazyPageWrapper>
        )
      },
      // Redirects for legacy routes
      {
        path: 'home',
        element: <Navigate to="/" replace />
      },
      {
        path: 'tech',
        element: <Navigate to="/technology" replace />
      },
      {
        path: 'dev',
        element: <Navigate to="/developers" replace />
      },
      {
        path: 'docs',
        element: <Navigate to="/developers/docs" replace />
      },
      // Company routes
      {
        path: 'company/about',
        element: (
          <LazyPageWrapper>
            <AboutPage />
          </LazyPageWrapper>
        )
      },
      {
        path: 'company/careers',
        element: (
          <LazyPageWrapper>
            <CareersPage />
          </LazyPageWrapper>
        )
      },
      {
        path: 'company/press',
        element: (
          <LazyPageWrapper>
            <PressPage />
          </LazyPageWrapper>
        )
      },
      {
        path: 'company/legal',
        element: (
          <LazyPageWrapper>
            <LegalPage />
          </LazyPageWrapper>
        )
      },
      {
        path: 'company/contact',
        element: (
          <LazyPageWrapper>
            <ContactPage />
          </LazyPageWrapper>
        )
      }
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
  return routeConfig.filter(route => route.path !== '/' && route.featured);
};

// Export types
export type { RouteConfig };
export default AppRouter;