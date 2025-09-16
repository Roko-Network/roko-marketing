import { COLORS, TYPOGRAPHY, LAYOUT, ANIMATIONS } from '@config/constants';
import type { ThemeColors, Typography } from '@types';

// Design System Theme Configuration
export const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  layout: LAYOUT,
  animations: ANIMATIONS,

  // Component-specific styling
  components: {
    button: {
      primary: {
        background: COLORS.teal,
        color: COLORS.white,
        border: 'none',
        hover: {
          background: '#00b894', // Darker teal
          transform: 'translateY(-2px)',
          shadow: '0 8px 25px rgba(0, 212, 170, 0.3)'
        }
      },
      secondary: {
        background: 'transparent',
        color: COLORS.primary,
        border: `2px solid ${COLORS.primary}`,
        hover: {
          background: COLORS.primary,
          color: COLORS.white,
          transform: 'translateY(-2px)'
        }
      },
      ghost: {
        background: 'transparent',
        color: COLORS.text.primary,
        border: 'none',
        hover: {
          background: COLORS.background.accent,
          transform: 'translateY(-1px)'
        }
      }
    },

    card: {
      background: COLORS.white,
      border: `1px solid ${COLORS.border.light}`,
      borderRadius: LAYOUT.borderRadius.lg,
      shadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      hover: {
        shadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-4px)'
      }
    },

    input: {
      background: COLORS.white,
      border: `2px solid ${COLORS.border.medium}`,
      borderRadius: LAYOUT.borderRadius.md,
      color: COLORS.text.primary,
      placeholder: COLORS.text.secondary,
      focus: {
        border: `2px solid ${COLORS.teal}`,
        shadow: `0 0 0 3px rgba(0, 212, 170, 0.1)`
      }
    },

    modal: {
      overlay: 'rgba(24, 24, 24, 0.8)',
      background: COLORS.white,
      borderRadius: LAYOUT.borderRadius.xl,
      shadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
    },

    navigation: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdrop: 'blur(10px)',
      border: `1px solid ${COLORS.border.light}`,
      shadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    },

    hero: {
      gradient: `linear-gradient(135deg, ${COLORS.background.primary} 0%, ${COLORS.background.accent} 100%)`,
      overlay: 'rgba(24, 24, 24, 0.05)'
    },

    code: {
      background: COLORS.dark,
      color: COLORS.teal,
      border: `1px solid ${COLORS.border.dark}`,
      borderRadius: LAYOUT.borderRadius.md,
      fontFamily: TYPOGRAPHY.fontFamily.mono
    }
  },

  // Responsive breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070
  },

  // Shadow system
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(0, 212, 170, 0.3)'
  },

  // Transitions
  transitions: {
    default: `all ${ANIMATIONS.duration.normal}ms ${ANIMATIONS.easing.ease}`,
    fast: `all ${ANIMATIONS.duration.fast}ms ${ANIMATIONS.easing.ease}`,
    slow: `all ${ANIMATIONS.duration.slow}ms ${ANIMATIONS.easing.ease}`,
    spring: `all ${ANIMATIONS.duration.normal}ms ${ANIMATIONS.easing.spring}`
  }
} as const;

// CSS Custom Properties for runtime theming
export const cssVariables = {
  // Colors
  '--color-primary': COLORS.primary,
  '--color-secondary': COLORS.secondary,
  '--color-tertiary': COLORS.tertiary,
  '--color-dark': COLORS.dark,
  '--color-teal': COLORS.teal,
  '--color-white': COLORS.white,
  '--color-black': COLORS.black,

  // Background colors
  '--bg-primary': COLORS.background.primary,
  '--bg-secondary': COLORS.background.secondary,
  '--bg-dark': COLORS.background.dark,
  '--bg-accent': COLORS.background.accent,

  // Text colors
  '--text-primary': COLORS.text.primary,
  '--text-secondary': COLORS.text.secondary,
  '--text-light': COLORS.text.light,
  '--text-accent': COLORS.text.accent,
  '--text-inverse': COLORS.text.inverse,

  // Border colors
  '--border-light': COLORS.border.light,
  '--border-medium': COLORS.border.medium,
  '--border-dark': COLORS.border.dark,

  // Typography
  '--font-display': TYPOGRAPHY.fontFamily.display,
  '--font-body': TYPOGRAPHY.fontFamily.body,
  '--font-mono': TYPOGRAPHY.fontFamily.mono,

  // Spacing
  '--spacing-xs': LAYOUT.spacing.xs,
  '--spacing-sm': LAYOUT.spacing.sm,
  '--spacing-md': LAYOUT.spacing.md,
  '--spacing-lg': LAYOUT.spacing.lg,
  '--spacing-xl': LAYOUT.spacing.xl,

  // Border radius
  '--radius-sm': LAYOUT.borderRadius.sm,
  '--radius-md': LAYOUT.borderRadius.md,
  '--radius-lg': LAYOUT.borderRadius.lg,
  '--radius-xl': LAYOUT.borderRadius.xl,

  // Shadows
  '--shadow-sm': theme.shadows.sm,
  '--shadow-md': theme.shadows.md,
  '--shadow-lg': theme.shadows.lg,
  '--shadow-xl': theme.shadows.xl,
  '--shadow-glow': theme.shadows.glow,

  // Transitions
  '--transition-default': theme.transitions.default,
  '--transition-fast': theme.transitions.fast,
  '--transition-slow': theme.transitions.slow,
  '--transition-spring': theme.transitions.spring
} as const;

// Dark theme variant
export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: {
      primary: COLORS.dark,
      secondary: '#1F1F1F',
      dark: COLORS.dark,
      accent: '#2A2A2A'
    },
    text: {
      primary: COLORS.white,
      secondary: '#B0B0B0',
      light: '#808080',
      accent: COLORS.teal,
      inverse: COLORS.dark
    },
    border: {
      light: '#2A2A2A',
      medium: '#404040',
      dark: '#606060'
    }
  },
  components: {
    ...theme.components,
    card: {
      ...theme.components.card,
      background: '#1F1F1F',
      border: `1px solid #2A2A2A`
    },
    input: {
      ...theme.components.input,
      background: '#1F1F1F',
      border: `2px solid #404040`,
      color: COLORS.white
    },
    navigation: {
      ...theme.components.navigation,
      background: 'rgba(24, 24, 24, 0.95)'
    }
  }
} as const;

// Type exports
export type Theme = typeof theme;
export type CSSVariables = typeof cssVariables;

// Utility functions for theme manipulation
export const getThemeValue = (path: string, fallback?: any) => {
  return path.split('.').reduce((obj, key) => obj?.[key], theme) || fallback;
};

export const applyTheme = (element: HTMLElement, themeVariables: Record<string, string>) => {
  Object.entries(themeVariables).forEach(([property, value]) => {
    element.style.setProperty(property, value);
  });
};

export const toggleDarkMode = (element: HTMLElement = document.documentElement) => {
  const isDark = element.classList.contains('dark');

  if (isDark) {
    element.classList.remove('dark');
    applyTheme(element, cssVariables);
  } else {
    element.classList.add('dark');
    applyTheme(element, {
      ...cssVariables,
      '--bg-primary': darkTheme.colors.background.primary,
      '--bg-secondary': darkTheme.colors.background.secondary,
      '--bg-accent': darkTheme.colors.background.accent,
      '--text-primary': darkTheme.colors.text.primary,
      '--text-secondary': darkTheme.colors.text.secondary,
      '--text-light': darkTheme.colors.text.light,
      '--border-light': darkTheme.colors.border.light,
      '--border-medium': darkTheme.colors.border.medium,
      '--border-dark': darkTheme.colors.border.dark
    });
  }

  return !isDark;
};