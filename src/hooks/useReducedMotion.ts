import { useState, useEffect } from 'react';

/**
 * Hook to detect user's preference for reduced motion
 * Respects the prefers-reduced-motion CSS media query
 * @returns boolean indicating whether user prefers reduced motion
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Check if matchMedia is supported
    if (!window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial state
    setPrefersReducedMotion(mediaQuery.matches);

    // Handle changes to the media query
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};