import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Performance monitoring
import { reportWebVitals } from '@utils/performance';

// Service Worker registration
import { registerSW } from '@utils/serviceWorker';

// Environment and feature flags
import { ENV, FEATURES } from '@config/constants';

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure you have a div with id="root" in your HTML.');
}

// Create React root
const root = ReactDOM.createRoot(rootElement);

// Render app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring
if (ENV.isProd) {
  reportWebVitals((metric) => {
    // Send to analytics service
    console.log('Performance metric:', metric);

    // You can send this to your analytics service
    // Example: analytics.track('web-vital', metric);
  });
}

// Service Worker registration for PWA
if (ENV.isProd && FEATURES.pwa) {
  registerSW({
    onSuccess: (registration) => {
      console.log('SW registered: ', registration);
    },
    onUpdate: (registration) => {
      console.log('SW updated: ', registration);

      // Notify user about update
      if (confirm('New version available! Reload to update?')) {
        window.location.reload();
      }
    },
    onError: (error) => {
      console.error('SW registration failed: ', error);
    }
  });
}

// Hot Module Replacement (HMR) for development
if (ENV.isDev && import.meta.hot) {
  import.meta.hot.accept();
}

// Development helpers
if (ENV.isDev) {
  // Expose useful debugging tools
  (window as any).__ROKO_DEBUG__ = {
    env: ENV,
    features: FEATURES,
    version: ENV.version,
    buildTime: ENV.buildTime
  };

  // Console welcome message
  console.log(
    `%cROKO Network Marketing Site%c

🚀 Version: ${ENV.version}
🏗️  Build: ${ENV.buildTime}
🧪 Environment: ${ENV.isDev ? 'Development' : 'Production'}
⚡ Features: ${Object.entries(FEATURES).filter(([, enabled]) => enabled).map(([name]) => name).join(', ')}

Visit https://roko.network for more information.
    `,
    'color: #00d4aa; font-size: 16px; font-weight: bold;',
    'color: #6B7280; font-size: 12px;'
  );
}