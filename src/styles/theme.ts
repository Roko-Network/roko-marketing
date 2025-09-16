import { COLORS, TYPOGRAPHY, LAYOUT, ANIMATIONS } from '../config/constants';

// Theme types
interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  // Add other color properties as needed
}

interface Typography {
  fontFamily: {
    primary: string;
    secondary: string;
    // Add other font properties as needed
  };
}

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
        background: COLORS.accent,
        color: COLORS.white,
        border: 'none',
        hover: {
          background: '#106EBE', // Darker professional blue
          transform: 'translateY(-2px)',
          shadow: '0 8px 25px rgba(0, 120, 212, 0.3)'
        }
      },
      secondary: {
        background: 'transparent',
        color: COLORS.accent,
        border: `2px solid ${COLORS.accent}`,
        hover: {
          background: COLORS.accent,
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
      background: COLORS.background.elevated,
      border: `1px solid ${COLORS.border.light}`,
      borderRadius: LAYOUT.borderRadius.lg,
      shadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      hover: {
        shadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-2px)'
      }
    },

    input: {
      background: COLORS.background.primary,
      border: `2px solid ${COLORS.border.medium}`,
      borderRadius: LAYOUT.borderRadius.md,
      color: COLORS.text.primary,
      placeholder: COLORS.text.tertiary,
      focus: {
        border: `2px solid ${COLORS.accent}`,
        shadow: `0 0 0 3px rgba(0, 120, 212, 0.1)`
      }
    },

    modal: {
      overlay: 'rgba(0, 0, 0, 0.5)',
      background: COLORS.background.primary,
      borderRadius: LAYOUT.borderRadius.xl,
      shadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
    },

    navigation: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdrop: 'blur(10px)',
      border: `1px solid ${COLORS.border.light}`,
      shadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
    },

    hero: {
      gradient: `linear-gradient(135deg, ${COLORS.background.primary} 0%, ${COLORS.background.accent} 100%)`,
      overlay: 'rgba(0, 120, 212, 0.03)'
    },

    code: {
      background: '#F8F9FA',
      color: COLORS.accent,
      border: `1px solid ${COLORS.border.medium}`,
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

// CSS Custom Properties for runtime theming - Light Theme Default
export const cssVariables = {
  // Brand colors
  '--color-primary': COLORS.primary,
  '--color-secondary': COLORS.secondary,
  '--color-tertiary': COLORS.tertiary,
  '--color-accent': COLORS.accent,
  '--color-teal': COLORS.teal,
  '--color-white': COLORS.white,
  '--color-black': COLORS.black,

  // Background colors - Light Theme
  '--bg-primary': COLORS.background.primary,
  '--bg-secondary': COLORS.background.secondary,
  '--bg-tertiary': COLORS.background.tertiary,
  '--bg-dark': COLORS.background.dark,
  '--bg-accent': COLORS.background.accent,
  '--bg-elevated': COLORS.background.elevated,

  // Text colors - Light Theme
  '--text-primary': COLORS.text.primary,
  '--text-secondary': COLORS.text.secondary,
  '--text-body': COLORS.text.body,
  '--text-tertiary': COLORS.text.tertiary,
  '--text-quaternary': COLORS.text.quaternary,
  '--text-accent': COLORS.text.accent,
  '--text-inverse': COLORS.text.inverse,

  // Border colors - Light Theme
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

// Dark theme variant - Cyberpunk style for optional toggle
export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: {
      primary: '#000000',
      secondary: '#0a0a0a',
      tertiary: '#181818',
      dark: '#181818',
      accent: '#2a2a2a',
      elevated: '#1a1a1a'
    },
    text: {
      primary: '#ffffff',
      secondary: '#E8EAEF',
      body: '#F5F6F8',
      tertiary: '#CDD1DB',
      quaternary: '#BAC0CC',
      accent: '#00d4aa',
      inverse: '#181818'
    },
    border: {
      light: 'rgba(186, 192, 204, 0.1)',
      medium: 'rgba(186, 192, 204, 0.2)',
      dark: 'rgba(186, 192, 204, 0.3)'
    }
  },
  components: {
    ...theme.components,
    card: {
      ...theme.components.card,
      background: 'rgba(24, 24, 24, 0.9)',
      border: `1px solid rgba(186, 192, 204, 0.1)`
    },
    input: {
      ...theme.components.input,
      background: '#1F1F1F',
      border: `2px solid #404040`,
      color: '#ffffff'
    },
    navigation: {
      ...theme.components.navigation,
      background: 'rgba(24, 24, 24, 0.95)'
    },
    button: {
      ...theme.components.button,
      primary: {
        background: 'linear-gradient(135deg, #00d4aa, #00ffcc)',
        color: '#181818',
        border: 'none',
        hover: {
          background: 'linear-gradient(135deg, #00b894, #00d4aa)',
          transform: 'translateY(-2px)',
          shadow: '0 8px 25px rgba(0, 212, 170, 0.4)'
        }
      }
    }
  }
} as const;

// Type exports
export type Theme = typeof theme;
export type CSSVariables = typeof cssVariables;

// Utility functions for theme manipulation
export const getThemeValue = (path: string, fallback?: any) => {
  return path.split('.').reduce((obj: any, key: string) => obj?.[key], theme as any) || fallback;
};

export const applyTheme = (element: HTMLElement, themeVariables: Record<string, string>) => {
  Object.entries(themeVariables).forEach(([property, value]) => {
    element.style.setProperty(property, value);
  });
};

export const toggleDarkMode = (element: HTMLElement = document.documentElement) => {
  const isDark = element.classList.contains('dark');

  if (isDark) {
    // Switch to light theme
    element.classList.remove('dark');
    applyTheme(element, cssVariables);
  } else {
    // Switch to dark theme (cyberpunk)
    element.classList.add('dark');
    applyTheme(element, {
      ...cssVariables,
      '--bg-primary': darkTheme.colors.background.primary,
      '--bg-secondary': darkTheme.colors.background.secondary,
      '--bg-tertiary': darkTheme.colors.background.tertiary,
      '--bg-accent': darkTheme.colors.background.accent,
      '--bg-elevated': darkTheme.colors.background.elevated,
      '--text-primary': darkTheme.colors.text.primary,
      '--text-secondary': darkTheme.colors.text.secondary,
      '--text-body': darkTheme.colors.text.body,
      '--text-tertiary': darkTheme.colors.text.tertiary,
      '--text-quaternary': darkTheme.colors.text.quaternary,
      '--text-accent': darkTheme.colors.text.accent,
      '--border-light': darkTheme.colors.border.light,
      '--border-medium': darkTheme.colors.border.medium,
      '--border-dark': darkTheme.colors.border.dark
    });
  }

  return !isDark;
};