/**
 * Pages Index - Centralized exports for all page components
 * Provides lazy loading wrappers and consistent exports
 */

import { lazy, ComponentType } from 'react';

// Types for page components
export interface PageComponent {
  displayName?: string;
}

export interface LazyPageComponent {
  (): Promise<{ default: React.ComponentType<any> }>;
}

// Lazy load all page components for optimal code splitting
export const HomePage = lazy(() => import('./Home/HomePage') as Promise<{ default: React.ComponentType<any> }>);
export const TechnologyPage = lazy(() => import('./Technology/TechnologyPage') as Promise<{ default: React.ComponentType<any> }>);
export const GovernancePage = lazy(() => import('./Governance/GovernancePage') as Promise<{ default: React.ComponentType<any> }>);
export const DevelopersPage = lazy(() => import('./Developers/DevelopersPage') as Promise<{ default: React.ComponentType<any> }>);
export const EcosystemPage = lazy(() => import('./Ecosystem/EcosystemPage') as Promise<{ default: React.ComponentType<any> }>);
export const NotFoundPage = lazy(() => import('./NotFoundPage') as Promise<{ default: React.ComponentType<any> }>);

// Page metadata for routing and navigation
export interface PageMetadata {
  title: string;
  description: string;
  path: string;
  component: LazyPageComponent;
  featured?: boolean;
  sections?: string[];
}

export const pageMetadata: Record<string, PageMetadata> = {
  home: {
    title: 'ROKO Network - The Temporal Layer for Web3',
    description: 'Build time-sensitive blockchain applications with nanosecond precision. IEEE 1588 PTP-grade synchronization for Web3.',
    path: '/',
    component: () => import('./Home/HomePage') as Promise<{ default: React.ComponentType<any> }>,
    featured: true
  },
  technology: {
    title: 'Technology - ROKO Network',
    description: 'Temporal blockchain infrastructure with nanosecond precision consensus and IEEE 1588 PTP synchronization.',
    path: '/technology',
    component: () => import('./Technology/TechnologyPage') as Promise<{ default: React.ComponentType<any> }>,
    featured: true,
    sections: ['temporal-layer', 'consensus', 'architecture', 'security']
  },
  governance: {
    title: 'Governance - ROKO Network',
    description: 'Decentralized decision making and proposal system for the ROKO Network temporal blockchain.',
    path: '/governance',
    component: () => import('./Governance/GovernancePage') as Promise<{ default: React.ComponentType<any> }>,
    featured: true,
    sections: ['proposals', 'voting', 'validators']
  },
  developers: {
    title: 'Developers - ROKO Network',
    description: 'Build time-sensitive dApps on ROKO Network with comprehensive SDKs, APIs, and developer tools.',
    path: '/developers',
    component: () => import('./Developers/DevelopersPage') as Promise<{ default: React.ComponentType<any> }>,
    featured: true,
    sections: ['docs', 'api', 'sdks', 'tutorials']
  },
  ecosystem: {
    title: 'Ecosystem - ROKO Network',
    description: 'Partners, integrations, and community projects building on the ROKO Network temporal blockchain.',
    path: '/ecosystem',
    component: () => import('./Ecosystem/EcosystemPage') as Promise<{ default: React.ComponentType<any> }>,
    featured: true,
    sections: ['partners', 'integrations', 'community']
  },
  notFound: {
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist.',
    path: '*',
    component: () => import('./NotFoundPage') as Promise<{ default: React.ComponentType<any> }>
  }
};

// Utility functions for page management
export const getPageMetadata = (path: string): PageMetadata | undefined => {
  return Object.values(pageMetadata).find(page => page.path === path);
};

export const getFeaturedPages = (): PageMetadata[] => {
  return Object.values(pageMetadata).filter(page => page.featured);
};

export const getPagesBySection = (section: string): PageMetadata[] => {
  return Object.values(pageMetadata).filter(page =>
    page.sections && page.sections.includes(section)
  );
};

export const getAllPaths = (): string[] => {
  const paths: string[] = [];

  Object.values(pageMetadata).forEach(page => {
    paths.push(page.path);

    // Add section paths
    if (page.sections && page.path !== '/') {
      page.sections.forEach(section => {
        paths.push(`${page.path}/${section}`);
      });
    }
  });

  return paths.filter(path => path !== '*');
};

// Preload functions for performance optimization
export const preloadPage = async (pageName: keyof typeof pageMetadata): Promise<void> => {
  try {
    const page = pageMetadata[pageName];
    if (page && page.component) {
      await page.component();
    }
  } catch (error) {
    console.warn(`Failed to preload page ${pageName}:`, error);
  }
};

export const preloadCriticalPages = async (): Promise<void> => {
  const criticalPages = ['home', 'technology', 'developers'] as const;

  await Promise.allSettled(
    criticalPages.map(page => preloadPage(page))
  );
};

// Page loading utilities
export const createPageLoader = (pageName: keyof typeof pageMetadata) => {
  return async () => {
    const page = pageMetadata[pageName];
    if (!page) {
      throw new Error(`Page ${pageName} not found`);
    }

    try {
      return await page.component();
    } catch (error) {
      console.error(`Failed to load page ${pageName}:`, error);
      // Fallback to not found page
      return await pageMetadata.notFound.component();
    }
  };
};

// SEO utilities
export const getPageSEO = (path: string) => {
  const page = getPageMetadata(path);
  if (!page) {
    return pageMetadata.notFound;
  }

  return {
    title: page.title,
    description: page.description,
    canonical: `https://roko.network${page.path === '/' ? '' : page.path}`,
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://roko.network${page.path === '/' ? '' : page.path}`,
      type: 'website',
      image: `https://roko.network/images/og-${path.replace('/', '') || 'home'}.png`
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      image: `https://roko.network/images/twitter-${path.replace('/', '') || 'home'}.png`
    }
  };
};

