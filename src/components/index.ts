/**
 * ROKO Network Components Index
 *
 * Central export file for all React components in the design system.
 * Organized by component type following atomic design principles.
 */

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

export { Layout } from './templates/Layout';
export { Header } from './organisms/Header';
export { Footer } from './organisms/Footer';
export { Navigation } from './molecules/Navigation';

// =============================================================================
// ERROR HANDLING
// =============================================================================

export { default as ErrorBoundary } from './organisms/ErrorBoundary';

// =============================================================================
// UI COMPONENTS (Existing)
// =============================================================================

export { Button } from './ui/Button';
export { Card } from './ui/Card';
export { NeonText } from './ui/NeonText';
export { TemporalCounter } from './ui/TemporalCounter';

// =============================================================================
// ATOMS
// =============================================================================

export { LoadingSpinner } from './atoms/LoadingSpinner';

// =============================================================================
// HERO SECTION (Existing)
// =============================================================================

export { HeroSection } from './HeroSection/HeroSection';

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type { LayoutProps, SEOProps } from './templates/Layout';
export type { HeaderProps } from './organisms/Header';
export type { FooterProps } from './organisms/Footer';
export type { NavigationProps } from './molecules/Navigation';