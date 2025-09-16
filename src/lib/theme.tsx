// Theme provider for ROKO Network design system
import React, { createContext, useContext, useEffect, useState } from 'react';
import { theme, darkTheme, toggleDarkMode, applyTheme, cssVariables } from '../styles/theme';
import type { Theme } from '../styles/theme';

interface ThemeContextType {
  theme: any; // Using any to avoid type conflicts between different Theme types
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light'
}) => {
  const [isDark, setIsDark] = useState(() => {
    // Check for saved theme preference or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('roko-theme');
      if (saved) {
        return saved === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return defaultTheme === 'dark';
  });

  const currentTheme = isDark ? darkTheme : theme;

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
    if (typeof window !== 'undefined') {
      localStorage.setItem('roko-theme', dark ? 'dark' : 'light');
    }
  };

  const toggleTheme = () => {
    const newTheme = toggleDarkMode();
    setTheme(newTheme);
  };

  // Apply theme to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Apply CSS variables
      applyTheme(root, cssVariables);
    }
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        // Only auto-switch if user hasn't manually set a preference
        const savedTheme = localStorage.getItem('roko-theme');
        if (!savedTheme) {
          setIsDark(e.matches);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    return () => {}; // No-op cleanup for SSR
  }, []);

  const contextValue: ThemeContextType = {
    theme: currentTheme,
    isDark,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};