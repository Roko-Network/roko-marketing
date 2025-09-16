/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Keep for optional dark mode toggle
  theme: {
    extend: {
      colors: {
        // Official ROKO Brand Colors - Optimized for Light Theme
        'roko': {
          'primary': '#4A5568',      // Dark Blue-Gray - Professional text
          'secondary': '#2D3748',    // Darker Gray - Primary headings
          'tertiary': '#1A202C',     // Darkest Gray - Body text
          'light': '#F7FAFC',        // Light background
        },
        // Professional Accent Colors
        'accent': {
          DEFAULT: '#0078D4',        // Professional Blue - CTAs
          'hover': '#106EBE',        // Darker Blue - Hover states
          'light': '#E3F2FD',        // Light Blue - Subtle backgrounds
          'teal': '#00796B',         // Professional Teal - Secondary actions
        },
        // Semantic System Colors - Light Theme Optimized
        'success': '#2E7D32',        // Dark Green - Success states
        'warning': '#F57C00',        // Orange - Warnings
        'error': '#D32F2F',          // Red - Errors
        'info': '#1976D2',           // Blue - Information
        // Background Hierarchy - Light Theme
        'bg': {
          'primary': '#FFFFFF',      // Pure white - Main background
          'secondary': '#F8F9FA',    // Light gray - Panels
          'tertiary': '#F1F3F4',     // Slightly darker - Cards
          'elevated': '#FFFFFF',     // White with shadow - Elevated surfaces
        },
        // Text Hierarchy - Professional Light Theme
        'text': {
          'primary': '#1A202C',      // Dark gray - Primary text (16.5:1 contrast)
          'secondary': '#2D3748',    // Medium dark - Secondary text (12.6:1 contrast)
          'body': '#4A5568',         // Medium gray - Body text (9.7:1 contrast)
          'tertiary': '#718096',     // Light gray - Muted text (7.0:1 contrast)
          'quaternary': '#A0AEC0',   // Very light - Placeholders (4.8:1 contrast)
          'light': '#FFFFFF',        // White text for dark backgrounds
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