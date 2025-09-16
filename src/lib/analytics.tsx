// Analytics provider for tracking user interactions and performance
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { ENV, FEATURES } from '@config/constants';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

interface AnalyticsContextType {
  track: (event: string, properties?: Record<string, any>) => void;
  page: (pageName: string, properties?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const track = (event: string, properties: Record<string, any> = {}) => {
    if (!FEATURES.analytics || !ENV.isProd) {
      console.log('Analytics Event:', event, properties);
      return;
    }

    // Implementation for your analytics service
    // Example: analytics.track(event, properties);

    // For now, we'll use a simple console log
    console.log('Analytics Event:', {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    });
  };

  const page = (pageName: string, properties: Record<string, any> = {}) => {
    if (!FEATURES.analytics || !ENV.isProd) {
      console.log('Analytics Page:', pageName, properties);
      return;
    }

    // Implementation for your analytics service
    // Example: analytics.page(pageName, properties);

    console.log('Analytics Page:', {
      page: pageName,
      properties: {
        ...properties,
        timestamp: Date.now(),
        url: window.location.href,
        referrer: document.referrer
      }
    });
  };

  const identify = (userId: string, traits: Record<string, any> = {}) => {
    if (!FEATURES.analytics || !ENV.isProd) {
      console.log('Analytics Identify:', userId, traits);
      return;
    }

    // Implementation for your analytics service
    // Example: analytics.identify(userId, traits);

    console.log('Analytics Identify:', {
      userId,
      traits: {
        ...traits,
        timestamp: Date.now()
      }
    });
  };

  useEffect(() => {
    // Initialize analytics
    if (FEATURES.analytics && ENV.isProd) {
      // Load your analytics scripts here
      // Example: loadAnalyticsScript();
    }

    // Track initial page load
    page('Page Load', {
      path: window.location.pathname,
      search: window.location.search,
      title: document.title
    });
  }, []);

  const contextValue: AnalyticsContextType = {
    track,
    page,
    identify
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};