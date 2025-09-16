/**
 * ROKO Network Page Transition Component
 *
 * Sophisticated page transitions with route-based animations,
 * loading states, and cyberpunk aesthetic
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation, useNavigationType } from 'react-router-dom';
import { pageTransitions, durations, shouldReduceMotion } from '@/utils/animations';

// Types for page transition configuration
export interface PageTransitionProps {
  children: React.ReactNode;
  transitionType?: keyof typeof pageTransitions;
  loadingComponent?: React.ComponentType;
  preserveScrollPosition?: boolean;
  customTransition?: any;
  className?: string;
}

interface LoadingProgressProps {
  progress: number;
  isVisible: boolean;
}

interface RouteTransitionInfo {
  from: string;
  to: string;
  direction: 'forward' | 'backward' | 'replace';
}

/**
 * Cyberpunk-styled loading progress bar
 */
const LoadingProgress: React.FC<LoadingProgressProps> = ({ progress, isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-roko-dark via-roko-primary/20 to-roko-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: durations.fast }}
    >
      {/* Main progress bar */}
      <motion.div
        className="h-full bg-gradient-to-r from-roko-accent to-roko-gradient-end relative overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: durations.fast, ease: 'easeOut' }}
      >
        {/* Glowing effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
        />
      </motion.div>

      {/* Particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-roko-accent rounded-full"
            animate={{
              x: ['-10px', '100vw'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              top: '50%',
              left: `-${Math.random() * 20}px`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Default loading component with cyberpunk styling
 */
const DefaultLoadingComponent: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-roko-dark/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: durations.fast }}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* ROKO Logo with pulse animation */}
        <motion.div
          className="w-16 h-16 relative"
          animate={{
            scale: [1, 1.1, 1],
            filter: [
              'drop-shadow(0 0 10px rgba(0, 212, 170, 0.4))',
              'drop-shadow(0 0 20px rgba(0, 212, 170, 0.8))',
              'drop-shadow(0 0 10px rgba(0, 212, 170, 0.4))',
            ],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <rect
              width="64"
              height="64"
              rx="12"
              fill="url(#logoGradient)"
              className="drop-shadow-lg"
            />
            <path
              d="M16 20h12c6.627 0 12 5.373 12 12s-5.373 12-12 12h-6v8h-6V20zm6 18h6c3.314 0 6-2.686 6-6s-2.686-6-6-6h-6v12z"
              fill="white"
            />
            <path
              d="M44 32c0-6.627-5.373-12-12-12h-4v6h4c3.314 0 6 2.686 6 6s-2.686 6-6 6h-4v6h4c6.627 0 12-5.373 12-12z"
              fill="white"
            />
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4aa" />
                <stop offset="100%" stopColor="#00ffcc" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Loading text */}
        <motion.div
          className="text-roko-tertiary font-display text-lg tracking-wider"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          INITIALIZING
        </motion.div>

        {/* Loading dots */}
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-roko-accent rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Get transition type based on route navigation
 */
const getTransitionType = (routeInfo: RouteTransitionInfo): keyof typeof pageTransitions => {
  const { from, to, direction } = routeInfo;

  // Special cases for specific routes
  if (to === '/') return 'fade';
  if (from === '/' && to !== '/') return 'slideUp';
  if (to === '/governance' || to === '/developers') return 'slideLeft';
  if (direction === 'backward') return 'slideRight';

  // Default transitions
  return 'slideUp';
};

/**
 * Main Page Transition Component
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  transitionType,
  loadingComponent: LoadingComponent = DefaultLoadingComponent,
  preserveScrollPosition = false,
  customTransition,
  className = '',
}) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prefersReducedMotion = useReducedMotion();
  const shouldUseReducedMotion = prefersReducedMotion || shouldReduceMotion();

  // State for loading and progress
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  // Store previous location for transition direction
  const prevLocation = useRef(location.pathname);
  const scrollPositions = useRef<Record<string, number>>({});

  // Route transition info
  const routeTransitionInfo: RouteTransitionInfo = {
    from: prevLocation.current,
    to: location.pathname,
    direction: navigationType === 'POP' ? 'backward' : 'forward',
  };

  // Determine transition type
  const finalTransitionType = transitionType || getTransitionType(routeTransitionInfo);
  const transition = customTransition || pageTransitions[finalTransitionType];

  // Simulate loading progress for demo purposes
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsLoading(false);
            setShowProgress(false);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 100);

      return () => clearInterval(interval);
    }
    return; // Explicit return for when not loading
  }, [isLoading]);

  // Handle route changes
  useEffect(() => {
    if (location.pathname !== prevLocation.current) {
      // Save scroll position for current route
      if (preserveScrollPosition) {
        scrollPositions.current[prevLocation.current] = window.scrollY;
      }

      // Start loading animation
      setIsLoading(true);
      setLoadingProgress(0);
      setShowProgress(true);

      // Simulate loading time
      const loadingTime = shouldUseReducedMotion ? 100 : 500;
      setTimeout(() => {
        setIsLoading(false);

        // Restore scroll position if needed
        if (preserveScrollPosition && scrollPositions.current[location.pathname]) {
          setTimeout(() => {
            window.scrollTo(0, scrollPositions.current[location.pathname]);
          }, 100);
        } else {
          window.scrollTo(0, 0);
        }
      }, loadingTime);

      prevLocation.current = location.pathname;
    }
  }, [location.pathname, preserveScrollPosition, shouldUseReducedMotion]);

  // Reduced motion fallback
  if (shouldUseReducedMotion) {
    return (
      <div className={`min-h-screen ${className}`}>
        <LoadingProgress progress={loadingProgress} isVisible={showProgress} />
        {isLoading && <LoadingComponent />}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: durations.fast }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Loading progress bar */}
      <LoadingProgress progress={loadingProgress} isVisible={showProgress} />

      {/* Loading overlay */}
      <AnimatePresence mode="wait">
        {isLoading && <LoadingComponent key="loading" />}
      </AnimatePresence>

      {/* Page content transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          className="min-h-screen"
          {...transition}
          onAnimationStart={() => {
            // Mark animation start for performance monitoring
            if (window.__ROKO_PERFORMANCE__) {
              window.__ROKO_PERFORMANCE__.marks.pageTransitionStart = performance.now();
            }
          }}
          onAnimationComplete={() => {
            // Mark animation complete for performance monitoring
            if (window.__ROKO_PERFORMANCE__) {
              window.__ROKO_PERFORMANCE__.marks.pageTransitionComplete = performance.now();
            }
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/**
 * Route-specific transition wrapper
 */
export const RouteTransition: React.FC<{
  children: React.ReactNode;
  type?: keyof typeof pageTransitions;
}> = ({ children, type }) => {
  return (
    <PageTransition transitionType={type}>
      {children}
    </PageTransition>
  );
};

/**
 * Section transition for within-page animations
 */
export const SectionTransition: React.FC<{
  children: React.ReactNode;
  delay?: number;
  type?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scale';
}> = ({ children, delay = 0, type = 'fadeUp' }) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldUseReducedMotion = prefersReducedMotion || shouldReduceMotion();

  if (shouldUseReducedMotion) {
    return <div>{children}</div>;
  }

  const variants = {
    fadeUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    },
    fadeLeft: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
    },
    fadeRight: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
    },
  };

  return (
    <motion.div
      {...variants[type]}
      transition={{
        duration: durations.slow,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;