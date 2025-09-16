import { useEffect } from 'react';

/**
 * Web Vitals Monitoring Hook
 *
 * Monitors Core Web Vitals metrics and reports them to analytics.
 * Helps track performance and user experience metrics.
 */
export const useWebVitals = () => {
  useEffect(() => {
    // Only run in production and when analytics is available
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    let vitalsReported = false;

    const reportVital = (metric: any) => {
      // Prevent duplicate reports
      if (vitalsReported) return;

      // Report to Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }

      // Report to custom analytics endpoint
      if (typeof fetch !== 'undefined') {
        fetch('/api/analytics/vitals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: metric.name,
            value: metric.value,
            delta: metric.delta,
            id: metric.id,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          }),
        }).catch((error) => {
          console.warn('Failed to report Web Vitals:', error);
        });
      }

      // Console log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric);
      }
    };

    // Dynamically import web-vitals library
    const loadWebVitals = async () => {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB, onINP } = await import('web-vitals');

        // Core Web Vitals
        getCLS(reportVital);
        getFID(reportVital);
        getLCP(reportVital);

        // Additional metrics
        getFCP(reportVital);
        getTTFB(reportVital);

        // New INP metric (replacing FID)
        if (onINP) {
          onINP(reportVital);
        }

        vitalsReported = true;
      } catch (error) {
        console.warn('Failed to load web-vitals library:', error);
      }
    };

    // Load with a slight delay to not impact initial page load
    const timeoutId = setTimeout(loadWebVitals, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
};

// Type definitions for global gtag function
declare global {
  function gtag(...args: any[]): void;
}