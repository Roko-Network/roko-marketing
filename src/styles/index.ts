/**
 * ROKO Network Design System Index
 *
 * Complete export of the design system including tokens, components, and utilities
 */

// Design Tokens
export * from './tokens';

// UI Components
export * from '../components/ui';

// Theme Provider
export {
  default as ThemeProvider,
  useTheme,
  getCSSVariable,
  setCSSVariable,
  removeCSSVariable,
  prefersReducedMotion,
  prefersHighContrast,
  prefersDarkScheme,
  createThemeClass,
  THEME_MODES,
  COLOR_SCHEMES,
  DEFAULT_THEME,
} from '../providers/ThemeProvider';

export type {
  ThemeMode,
  ColorScheme,
  ThemeConfig,
  ThemeContextValue,
  ThemeProviderProps,
} from '../providers/ThemeProvider';

// Accessibility Utilities
export {
  FocusTrap,
  createFocusTrap,
  moveFocusTo,
  focusFirstFocusable,
  getFocusableElements,
  generateId,
  setAriaAttributes,
  removeAriaAttributes,
  createLiveRegion,
  announceToScreenReader,
  createDescribedBy,
  createLabelledBy,
  NavigationDirection,
  KeyboardNavigationHandler,
  createKeyboardNavigation,
  RovingTabindexManager,
  createRovingTabindex,
  isScreenReaderActive,
  createSROnlyText,
  updateSRText,
  validateColorContrast,
  hasAccessibleName,
  useFocusTrap,
  useKeyboardNavigation,
  useAnnouncer,
} from '../utils/accessibility';

export type {
  NavigationOptions,
} from '../utils/accessibility';