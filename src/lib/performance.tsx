// Performance monitoring provider
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { initPerformanceMonitoring, timing } from '@utils/performance';

interface PerformanceContextType {
  timing: typeof timing;
  markMilestone: (name: string) => void;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

interface PerformanceProviderProps {
  children: ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();

    // Mark React app start
    timing.start('react-app');

    return () => {
      // Mark React app end
      timing.end('react-app');
    };
  }, []);

  const markMilestone = (name: string) => {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(name);
    }
  };

  const contextValue: PerformanceContextType = {
    timing,
    markMilestone
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};