/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Official ROKO Brand Colors
        'roko': {
          'primary': '#BAC0CC',      // Light Blue-Gray - Primary brand
          'secondary': '#BCC1D1',    // Light Gray - Secondary elements
          'tertiary': '#D9DBE3',     // Lightest Gray - Subtle accents
          'dark': '#181818',         // Near Black - Text and contrasts
        },
        // Teal Accent Colors
        'teal': {
          DEFAULT: '#00d4aa',        // Bright Teal - CTAs and highlights
          'hover': '#00ffcc',        // Bright Cyan - Hover states
          'dark': '#00a084',         // Dark Teal - Active states
        },
        // Semantic System Colors
        'success': '#10b981',        // Emerald - Success states
        'warning': '#f59e0b',        // Amber - Warnings
        'error': '#ef4444',          // Red - Errors
        'info': '#3b82f6',           // Blue - Information
        // Background Hierarchy
        'bg': {
          'primary': '#000000',      // Main background
          'secondary': '#0a0a0a',    // Panels
          'tertiary': '#181818',     // Cards (ROKO Dark)
          'elevated': '#2a2a2a',     // Elevated surfaces
        },
        // Text Hierarchy
        'text': {
          'primary': '#ffffff',      // Primary text on dark
          'secondary': '#D9DBE3',    // Secondary (ROKO Light Gray)
          'tertiary': '#BCC1D1',     // Muted (ROKO Gray)
          'quaternary': '#BAC0CC',   // Subtle (ROKO Primary)
          'dark': '#181818',         // Dark text on light
        }
      },
      fontFamily: {
        // Official ROKO Typography Stack
        'display': ['Rajdhani', 'sans-serif'],      // Headlines, Hero text
        'body': ['HK Guise', 'system-ui', 'sans-serif'],  // Body text, UI elements (fallback to system)
        'accent': ['Aeonik TRIAL', 'sans-serif'],   // Special features
        'mono': ['JetBrains Mono', 'monospace'],    // Code blocks
        // Fallbacks
        'sans': ['HK Guise', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'timeline': 'timeline 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        timeline: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
}