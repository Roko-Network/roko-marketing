/**
 * ROKO Network Theme Provider
 *
 * Manages theme state, CSS variable injection, and system preferences.
 * Provides cyberpunk dark theme with temporal precision styling.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { tokens } from '@/styles/tokens';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export type ThemeMode = 'dark' | 'light' | 'system';
export type ColorScheme = 'dark' | 'light';

export interface ThemeConfig {
  /** Current theme mode */
  mode: ThemeMode;
  /** Resolved color scheme */
  resolvedScheme: ColorScheme;
  /** Enable temporal effects */
  temporalEffects: boolean;
  /** Enable reduced motion */
  reducedMotion: boolean;
  /** Enable high contrast */
  highContrast: boolean;
  /** Custom CSS properties */
  customProperties?: Record<string, string>;
}

export interface ThemeContextValue {
  /** Current theme configuration */
  theme: ThemeConfig;
  /** Set theme mode */
  setTheme: (mode: ThemeMode) => void;
  /** Toggle between dark and light */
  toggleTheme: () => void;
  /** Toggle temporal effects */
  toggleTemporalEffects: () => void;
  /** Set custom CSS property */
  setCustomProperty: (property: string, value: string) => void;
  /** Remove custom CSS property */
  removeCustomProperty: (property: string) => void;
  /** Check if theme is ready */
  isReady: boolean;
}

// =============================================================================
// CONTEXT CREATION
// =============================================================================

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// =============================================================================
// THEME PROVIDER COMPONENT
// =============================================================================

export interface ThemeProviderProps {
  /** Initial theme mode */
  defaultTheme?: ThemeMode;
  /** Enable temporal effects by default */
  defaultTemporalEffects?: boolean;
  /** Storage key for persistence */
  storageKey?: string;
  /** Disable system preference detection */
  disableSystemDetection?: boolean;
  /** Custom theme CSS properties */
  customProperties?: Record<string, string>;
  /** Children components */
  children: React.ReactNode;
}

export function ThemeProvider({
  defaultTheme = 'system',
  defaultTemporalEffects = true,
  storageKey = 'roko-theme',
  disableSystemDetection = false,
  customProperties = {},
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeConfig>({
    mode: defaultTheme,
    resolvedScheme: 'dark', // Default to dark (cyberpunk theme)
    temporalEffects: defaultTemporalEffects,
    reducedMotion: false,
    highContrast: false,
    customProperties,
  });
  const [isReady, setIsReady] = useState(false);

  // Detect system preferences
  const getSystemPreferences = useCallback(() => {
    if (typeof window === 'undefined') {
      return {
        colorScheme: 'dark' as ColorScheme,
        reducedMotion: false,
        highContrast: false,
      };
    }

    const mediaQueries = {
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
    } as const;

    return mediaQueries;
  }, []);

  // Resolve color scheme based on mode and system preferences
  const resolveColorScheme = useCallback((mode: ThemeMode): ColorScheme => {
    if (mode === 'system') {
      return getSystemPreferences().colorScheme;
    }
    return mode as ColorScheme;
  }, [getSystemPreferences]);

  // Update CSS variables
  const updateCSSVariables = useCallback((config: ThemeConfig) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    // Apply theme-specific CSS variables
    Object.entries(tokens.colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--color-${key}`, value);
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--color-${key}-${subKey}`, subValue);
        });
      }
    });

    // Apply typography variables
    Object.entries(tokens.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });

    // Apply spacing variables
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--space-${key}`, value);
    });

    // Apply shadow variables
    Object.entries(tokens.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Apply custom properties
    Object.entries(config.customProperties || {}).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Set theme-specific properties
    root.style.setProperty('--theme-mode', config.mode);
    root.style.setProperty('--theme-scheme', config.resolvedScheme);

    // Handle temporal effects
    root.style.setProperty(
      '--temporal-effects-enabled',
      config.temporalEffects ? '1' : '0'
    );

    // Apply data attributes for CSS targeting
    root.setAttribute('data-theme', config.resolvedScheme);
    root.setAttribute('data-temporal-effects', config.temporalEffects.toString());
    root.setAttribute('data-reduced-motion', config.reducedMotion.toString());
    root.setAttribute('data-high-contrast', config.highContrast.toString());
  }, []);

  // Set theme mode
  const setTheme = useCallback((mode: ThemeMode) => {
    const resolvedScheme = resolveColorScheme(mode);
    const systemPreferences = getSystemPreferences();

    const newTheme: ThemeConfig = {
      ...theme,
      mode,
      resolvedScheme,
      reducedMotion: systemPreferences.reducedMotion,
      highContrast: systemPreferences.highContrast,
    };

    setThemeState(newTheme);
    updateCSSVariables(newTheme);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          mode,
          temporalEffects: newTheme.temporalEffects,
          customProperties: newTheme.customProperties,
        }));
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  }, [theme, resolveColorScheme, getSystemPreferences, updateCSSVariables, storageKey]);

  // Toggle between dark and light themes
  const toggleTheme = useCallback(() => {
    const newMode: ThemeMode = theme.mode === 'dark' ? 'light' : 'dark';
    setTheme(newMode);
  }, [theme.mode, setTheme]);

  // Toggle temporal effects
  const toggleTemporalEffects = useCallback(() => {
    const newTheme: ThemeConfig = {
      ...theme,
      temporalEffects: !theme.temporalEffects,
    };

    setThemeState(newTheme);
    updateCSSVariables(newTheme);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        const parsedStored = stored ? JSON.parse(stored) : {};
        localStorage.setItem(storageKey, JSON.stringify({
          ...parsedStored,
          temporalEffects: newTheme.temporalEffects,
        }));
      } catch (error) {
        console.warn('Failed to save temporal effects to localStorage:', error);
      }
    }
  }, [theme, updateCSSVariables, storageKey]);

  // Set custom CSS property
  const setCustomProperty = useCallback((property: string, value: string) => {
    const newCustomProperties = {
      ...theme.customProperties,
      [property]: value,
    };

    const newTheme: ThemeConfig = {
      ...theme,
      customProperties: newCustomProperties,
    };

    setThemeState(newTheme);
    updateCSSVariables(newTheme);

    // Update localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        const parsedStored = stored ? JSON.parse(stored) : {};
        localStorage.setItem(storageKey, JSON.stringify({
          ...parsedStored,
          customProperties: newCustomProperties,
        }));
      } catch (error) {
        console.warn('Failed to save custom properties to localStorage:', error);
      }
    }
  }, [theme, updateCSSVariables, storageKey]);

  // Remove custom CSS property
  const removeCustomProperty = useCallback((property: string) => {
    const newCustomProperties = { ...theme.customProperties };
    delete newCustomProperties[property];

    const newTheme: ThemeConfig = {
      ...theme,
      customProperties: newCustomProperties,
    };

    setThemeState(newTheme);
    updateCSSVariables(newTheme);

    // Remove from DOM
    if (typeof window !== 'undefined') {
      document.documentElement.style.removeProperty(property);

      // Update localStorage
      try {
        const stored = localStorage.getItem(storageKey);
        const parsedStored = stored ? JSON.parse(stored) : {};
        localStorage.setItem(storageKey, JSON.stringify({
          ...parsedStored,
          customProperties: newCustomProperties,
        }));
      } catch (error) {
        console.warn('Failed to update localStorage:', error);
      }
    }
  }, [theme, updateCSSVariables, storageKey]);

  // Initialize theme from localStorage and system preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let initialTheme = defaultTheme;
    let initialTemporalEffects = defaultTemporalEffects;
    let initialCustomProperties = customProperties;

    // Load from localStorage
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        initialTheme = parsed.mode || defaultTheme;
        initialTemporalEffects = parsed.temporalEffects ?? defaultTemporalEffects;
        initialCustomProperties = { ...customProperties, ...parsed.customProperties };
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }

    const systemPreferences = getSystemPreferences();
    const resolvedScheme = resolveColorScheme(initialTheme);

    const initialThemeConfig: ThemeConfig = {
      mode: initialTheme,
      resolvedScheme,
      temporalEffects: initialTemporalEffects,
      reducedMotion: systemPreferences.reducedMotion,
      highContrast: systemPreferences.highContrast,
      customProperties: initialCustomProperties,
    };

    setThemeState(initialThemeConfig);
    updateCSSVariables(initialThemeConfig);
    setIsReady(true);
  }, [
    defaultTheme,
    defaultTemporalEffects,
    customProperties,
    storageKey,
    getSystemPreferences,
    resolveColorScheme,
    updateCSSVariables,
  ]);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || disableSystemDetection) return;

    const mediaQueries = [
      window.matchMedia('(prefers-color-scheme: dark)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
    ];

    const handleChange = () => {
      const systemPreferences = getSystemPreferences();
      const resolvedScheme = resolveColorScheme(theme.mode);

      const updatedTheme: ThemeConfig = {
        ...theme,
        resolvedScheme,
        reducedMotion: systemPreferences.reducedMotion,
        highContrast: systemPreferences.highContrast,
      };

      setThemeState(updatedTheme);
      updateCSSVariables(updatedTheme);
    };

    // Add listeners
    mediaQueries.forEach(mq => mq.addEventListener('change', handleChange));

    // Cleanup
    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', handleChange));
    };
  }, [
    theme,
    disableSystemDetection,
    getSystemPreferences,
    resolveColorScheme,
    updateCSSVariables,
  ]);

  const contextValue: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
    toggleTemporalEffects,
    setCustomProperty,
    removeCustomProperty,
    isReady,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// =============================================================================
// THEME HOOK
// =============================================================================

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

// =============================================================================
// THEME UTILITIES
// =============================================================================

/**
 * Get CSS variable value
 */
export function getCSSVariable(property: string, fallback?: string): string {
  if (typeof window === 'undefined') {
    return fallback || '';
  }

  return getComputedStyle(document.documentElement)
    .getPropertyValue(property)
    .trim() || fallback || '';
}

/**
 * Set CSS variable value
 */
export function setCSSVariable(property: string, value: string): void {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(property, value);
}

/**
 * Remove CSS variable
 */
export function removeCSSVariable(property: string): void {
  if (typeof window === 'undefined') return;
  document.documentElement.style.removeProperty(property);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Check if user prefers dark color scheme
 */
export function prefersDarkScheme(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Create theme-aware class name
 */
export function createThemeClass(
  baseClass: string,
  themeClass?: string,
  condition?: boolean
): string {
  if (condition === false) return baseClass;
  return themeClass ? `${baseClass} ${themeClass}` : baseClass;
}

// =============================================================================
// THEME CONSTANTS
// =============================================================================

/**
 * Available theme modes
 */
export const THEME_MODES: ThemeMode[] = ['dark', 'light', 'system'];

/**
 * Available color schemes
 */
export const COLOR_SCHEMES: ColorScheme[] = ['dark', 'light'];

/**
 * Default theme configuration
 */
export const DEFAULT_THEME: ThemeConfig = {
  mode: 'dark',
  resolvedScheme: 'dark',
  temporalEffects: true,
  reducedMotion: false,
  highContrast: false,
  customProperties: {},
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ThemeProvider;