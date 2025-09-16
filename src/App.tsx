import React, { useEffect } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Router
import AppRouter from './router';

// Providers and configurations
import { ThemeProvider } from '@lib/theme';
import { PerformanceProvider } from '@lib/performance';
import { AnalyticsProvider } from '@lib/analytics';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Error Boundary
import ErrorBoundary from '@components/organisms/ErrorBoundary';

// Global styles and theme
import '@styles/globals.css';

// Constants
import { ENV, PERFORMANCE } from '@config/constants';

// Web Vitals monitoring
import { reportWebVitals } from '@utils/performance';

// QueryClient for data fetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Main App component
const App: React.FC = () => {
  useEffect(() => {
    // Initialize performance monitoring
    if (ENV.isProd && PERFORMANCE.thresholds) {
      reportWebVitals((metric) => {
        // Send metrics to analytics service
        console.log('Web Vital:', metric);

        // Check against thresholds and alert if needed
        const { name, value } = metric;
        const threshold = PERFORMANCE.thresholds[name.toLowerCase() as keyof typeof PERFORMANCE.thresholds];

        if (threshold && value > threshold) {
          console.warn(`Performance threshold exceeded for ${name}: ${value}ms > ${threshold}ms`);
          // TODO: Send alert to monitoring service
        }
      });
    }

    // Set up global error handling
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // TODO: Send to error reporting service
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      // TODO: Send to error reporting service
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <PerformanceProvider>
            <AnalyticsProvider>
              <div className="App">
                <AppRouter />
              </div>
            </AnalyticsProvider>
          </PerformanceProvider>
        </ThemeProvider>

        {/* Development tools */}
        {ENV.isDev && (
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-right"
          />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;