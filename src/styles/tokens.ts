/**
 * ROKO Network Design Tokens
 *
 * Official brand colors and design system tokens for the ROKO Network marketing site.
 * Implements cyberpunk aesthetics with nanosecond precision temporal theme.
 */

// =============================================================================
// COLOR SYSTEM
// =============================================================================

/**
 * Official ROKO Brand Colors (from Figma specifications)
 */
export const colors = {
  // Primary Brand Colors
  primary: '#BAC0CC',      // Light Blue-Gray - Primary brand color
  secondary: '#BCC1D1',    // Light Gray - Secondary elements
  tertiary: '#D9DBE3',     // Lightest Gray - Subtle accents
  dark: '#181818',         // Near Black - Main backgrounds and text contrast

  // Accent Colors (CTAs and Interactive Elements)
  accent: '#00d4aa',       // Bright Teal - Primary CTAs and highlights
  accentHover: '#00ffcc',  // Bright Cyan - Hover states and emphasis

  // Extended Palette for Cyberpunk Theme
  gradientStart: '#00d4aa',
  gradientEnd: '#00ffcc',

  // System Colors
  success: '#10b981',      // Emerald - Success states and confirmations
  warning: '#f59e0b',      // Amber - Warnings and cautions
  error: '#ef4444',        // Red - Errors and destructive actions
  info: '#3b82f6',         // Blue - Information and neutral states

  // Background System
  background: {
    primary: '#000000',    // Pure black - Main site background
    secondary: '#0a0a0a',  // Near black - Panel backgrounds
    tertiary: '#181818',   // ROKO Dark - Card backgrounds
    elevated: '#2a2a2a',   // Elevated surfaces and modals
    overlay: 'rgba(24, 24, 24, 0.95)', // Modal overlays with ROKO dark
  },

  // Text Colors
  text: {
    primary: '#ffffff',    // Primary text on dark backgrounds
    secondary: '#D9DBE3',  // Secondary text - ROKO tertiary
    tertiary: '#BCC1D1',   // Muted text - ROKO secondary
    accent: '#00d4aa',     // Accent text - teal
    dark: '#181818',       // Dark text for light backgrounds
    link: '#BAC0CC',       // Link default - ROKO primary
    linkHover: '#00d4aa',  // Link hover - teal accent
  },

  // Border Colors
  border: {
    primary: 'rgba(186, 192, 204, 0.2)',   // Subtle borders
    secondary: 'rgba(186, 192, 204, 0.1)',  // Ultra-subtle borders
    accent: 'rgba(0, 212, 170, 0.3)',      // Accent borders
    focus: '#00d4aa',                       // Focus indicator borders
  },

  // Gradients
  gradients: {
    hero: 'linear-gradient(135deg, #BAC0CC 0%, #D9DBE3 100%)',
    accent: 'linear-gradient(135deg, #00d4aa 0%, #00ffcc 100%)',
    dark: 'linear-gradient(180deg, #000000 0%, #181818 100%)',
    glow: 'radial-gradient(circle, #00d4aa 0%, transparent 70%)',
    cyberpunk: 'linear-gradient(45deg, #00d4aa 0%, #00ffcc 30%, #BAC0CC 100%)',
    temporal: 'linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(186, 192, 204, 0.05) 100%)',
  },
} as const;

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

/**
 * Font Families (following brand guidelines)
 */
export const fonts = {
  display: "'Rajdhani', 'HK Guise', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "'HK Guise', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  accent: "'Aeonik TRIAL', 'HK Guise', sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Courier New', monospace",
} as const;

/**
 * Font Weights
 */
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/**
 * Typography Scale (Major Third - 1.25 ratio)
 * Responsive scaling built-in with desktop-first approach
 */
export const typography = {
  // Display Typography - Reduced sizes for better readability
  hero: {
    desktop: { fontSize: '3.5rem', lineHeight: 1.1 },     // 56px (was 76px)
    tablet: { fontSize: '2.75rem', lineHeight: 1.1 },     // 44px (was 64px)
    mobile: { fontSize: '2.25rem', lineHeight: 1.1 },     // 36px (was 48px)
  },
  h1: {
    desktop: { fontSize: '2.75rem', lineHeight: 1.2 },    // 44px (was 56px)
    tablet: { fontSize: '2.25rem', lineHeight: 1.2 },     // 36px (was 44px)
    mobile: { fontSize: '1.875rem', lineHeight: 1.2 },    // 30px (was 36px)
  },
  h2: {
    desktop: { fontSize: '2.25rem', lineHeight: 1.2 },    // 36px (was 48px)
    tablet: { fontSize: '1.875rem', lineHeight: 1.2 },    // 30px (was 40px)
    mobile: { fontSize: '1.5rem', lineHeight: 1.2 },      // 24px (was 32px)
  },
  h3: {
    desktop: { fontSize: '1.875rem', lineHeight: 1.3 },   // 30px (was 36px)
    tablet: { fontSize: '1.5rem', lineHeight: 1.3 },      // 24px (was 30px)
    mobile: { fontSize: '1.25rem', lineHeight: 1.3 },     // 20px (was 24px)
  },
  h4: {
    desktop: { fontSize: '1.5rem', lineHeight: 1.4 },     // 24px (was 28px)
    tablet: { fontSize: '1.25rem', lineHeight: 1.4 },     // 20px (was 24px)
    mobile: { fontSize: '1.125rem', lineHeight: 1.4 },    // 18px (was 20px)
  },
  h5: {
    desktop: { fontSize: '1.25rem', lineHeight: 1.4 },    // 20px (was 24px)
    tablet: { fontSize: '1.125rem', lineHeight: 1.4 },    // 18px (was 20px)
    mobile: { fontSize: '1rem', lineHeight: 1.4 },        // 16px (was 18px)
  },

  // Body Typography
  bodyLg: {
    desktop: { fontSize: '1.25rem', lineHeight: 1.6 },    // 20px
    tablet: { fontSize: '1.125rem', lineHeight: 1.6 },    // 18px
    mobile: { fontSize: '1rem', lineHeight: 1.6 },        // 16px
  },
  body: {
    desktop: { fontSize: '1.125rem', lineHeight: 1.6 },   // 18px
    tablet: { fontSize: '1rem', lineHeight: 1.6 },        // 16px
    mobile: { fontSize: '1rem', lineHeight: 1.6 },        // 16px (min readable size)
  },
  bodySm: {
    desktop: { fontSize: '1rem', lineHeight: 1.5 },       // 16px
    tablet: { fontSize: '0.875rem', lineHeight: 1.5 },    // 14px
    mobile: { fontSize: '0.875rem', lineHeight: 1.5 },    // 14px
  },
  caption: {
    desktop: { fontSize: '0.875rem', lineHeight: 1.4 },   // 14px
    tablet: { fontSize: '0.8125rem', lineHeight: 1.4 },   // 13px
    mobile: { fontSize: '0.75rem', lineHeight: 1.4 },     // 12px
  },
  micro: {
    desktop: { fontSize: '0.75rem', lineHeight: 1.4 },    // 12px
    tablet: { fontSize: '0.6875rem', lineHeight: 1.4 },   // 11px
    mobile: { fontSize: '0.625rem', lineHeight: 1.4 },    // 10px
  },
} as const;

/**
 * Letter Spacing
 */
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// =============================================================================
// SPACING SYSTEM
// =============================================================================

/**
 * 8-Point Grid System
 * All spacing values are multiples of 8px for consistent rhythm
 */
export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem',    // 256px
} as const;

// =============================================================================
// DESIGN PROPERTIES
// =============================================================================

/**
 * Border Radius System
 */
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

/**
 * Box Shadow System (Cyberpunk-themed)
 */
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // Cyberpunk Glow Effects
  glow: '0 0 20px rgba(0, 212, 170, 0.3)',
  glowHover: '0 0 30px rgba(0, 212, 170, 0.4)',
  glowFocus: '0 0 0 3px rgba(0, 212, 170, 0.5)',
  neon: '0 0 5px #00d4aa, 0 0 10px #00d4aa, 0 0 15px #00d4aa',
  temporal: '0 4px 20px rgba(0, 212, 170, 0.2), 0 0 40px rgba(186, 192, 204, 0.1)',
} as const;

/**
 * Animation Timing Functions
 */
export const timing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  temporal: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Custom temporal precision easing
} as const;

/**
 * Animation Durations (in milliseconds)
 */
export const duration = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
  slowest: 1200,
  temporal: 1618, // Golden ratio-based duration for temporal effects
} as const;

// =============================================================================
// RESPONSIVE BREAKPOINTS
// =============================================================================

/**
 * Mobile-first responsive breakpoints
 */
export const breakpoints = {
  sm: '640px',    // Small tablets
  md: '768px',    // Tablets portrait
  lg: '1024px',   // Small laptops / tablets landscape
  xl: '1280px',   // Desktops
  '2xl': '1536px', // Large screens

  // Additional breakpoints for fine-grained control
  xs: '480px',    // Large phones
  '3xl': '1920px', // Ultra-wide screens
} as const;

/**
 * Container max-widths for each breakpoint
 */
export const containers = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px', // Design max-width
} as const;

// =============================================================================
// Z-INDEX SYSTEM
// =============================================================================

/**
 * Z-index scale for layering elements
 */
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

/**
 * Button Design Tokens
 */
export const button = {
  height: {
    sm: '2rem',     // 32px
    md: '2.5rem',   // 40px
    lg: '3rem',     // 48px
    xl: '3.5rem',   // 56px
  },
  padding: {
    sm: '0.5rem 1rem',     // 8px 16px
    md: '0.75rem 1.5rem',  // 12px 24px
    lg: '1rem 2rem',       // 16px 32px
    xl: '1.25rem 2.5rem',  // 20px 40px
  },
  borderRadius: borderRadius.lg,
  fontWeight: fontWeights.semibold,
  letterSpacing: letterSpacing.wide,
} as const;

/**
 * Card Design Tokens
 */
export const card = {
  padding: {
    sm: spacing[4],   // 16px
    md: spacing[6],   // 24px
    lg: spacing[8],   // 32px
  },
  borderRadius: borderRadius.xl,
  backdropBlur: '10px',
  background: 'rgba(24, 24, 24, 0.9)',
  border: '1px solid rgba(186, 192, 204, 0.1)',
} as const;

/**
 * Input Design Tokens
 */
export const input = {
  height: {
    sm: '2rem',     // 32px
    md: '2.5rem',   // 40px
    lg: '3rem',     // 48px
  },
  padding: {
    sm: '0.5rem 0.75rem',   // 8px 12px
    md: '0.75rem 1rem',     // 12px 16px
    lg: '1rem 1.25rem',     // 16px 20px
  },
  borderRadius: borderRadius.md,
  fontSize: typography.body.desktop.fontSize,
} as const;

// =============================================================================
// ACCESSIBILITY TOKENS
// =============================================================================

/**
 * Accessibility Design Tokens
 */
export const a11y = {
  // Minimum touch target size
  minTouchTarget: '44px',

  // Focus ring specifications
  focusRing: {
    width: '3px',
    offset: '2px',
    color: colors.accent,
    style: 'solid',
  },

  // Skip link specifications
  skipLink: {
    position: 'absolute',
    top: '-40px',
    left: '0',
    background: colors.accent,
    color: colors.dark,
    padding: '8px 16px',
    textDecoration: 'none',
    zIndex: zIndex.skipLink,
    transition: 'top 0.2s ease',
  },

  // Color contrast ratios (WCAG 2.2 AA)
  contrast: {
    normal: 4.5,  // Normal text
    large: 3.0,   // Large text (18pt+ or 14pt+ bold)
    ui: 3.0,      // UI components
  },
} as const;

// =============================================================================
// EXPORT ALL TOKENS
// =============================================================================

/**
 * Complete design token system
 */
export const tokens = {
  colors,
  fonts,
  fontWeights,
  typography,
  letterSpacing,
  spacing,
  borderRadius,
  shadows,
  timing,
  duration,
  breakpoints,
  containers,
  zIndex,
  button,
  card,
  input,
  a11y,
} as const;

// Type definitions for TypeScript support
export type Colors = typeof colors;
export type Fonts = typeof fonts;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Breakpoints = typeof breakpoints;
export type DesignTokens = typeof tokens;