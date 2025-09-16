/**
 * ROKO Network Accessibility Utilities
 *
 * Comprehensive accessibility utilities for focus management, ARIA helpers,
 * keyboard navigation, and screen reader support. Ensures WCAG 2.2 AA compliance.
 */

// =============================================================================
// FOCUS MANAGEMENT
// =============================================================================

/**
 * Focus trap utility for modals and dialogs
 */
export class FocusTrap {
  private element: HTMLElement;
  private previouslyFocusedElement: HTMLElement | null = null;
  private isActive = false;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  /**
   * Get all focusable elements within the trap
   */
  private getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input[type="text"]:not([disabled])',
      'input[type="radio"]:not([disabled])',
      'input[type="checkbox"]:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(',');

    return Array.from(
      this.element.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter(element => {
      return element.offsetParent !== null && !element.hasAttribute('hidden');
    });
  }

  /**
   * Activate the focus trap
   */
  activate(): void {
    if (this.isActive) return;

    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    this.isActive = true;

    // Focus the first focusable element
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Add event listeners
    document.addEventListener('keydown', this.handleKeyDown);
    this.element.addEventListener('focusin', this.handleFocusIn);
  }

  /**
   * Deactivate the focus trap
   */
  deactivate(): void {
    if (!this.isActive) return;

    this.isActive = false;

    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeyDown);
    this.element.removeEventListener('focusin', this.handleFocusIn);

    // Restore focus
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  }

  /**
   * Handle keydown events for focus trapping
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.isActive || event.key !== 'Tab') return;

    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab (backward)
      if (activeElement === firstElement || !this.element.contains(activeElement)) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab (forward)
      if (activeElement === lastElement || !this.element.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  /**
   * Handle focus events to ensure focus stays within trap
   */
  private handleFocusIn = (event: FocusEvent): void => {
    if (!this.isActive) return;

    const target = event.target as HTMLElement;
    if (!this.element.contains(target)) {
      event.preventDefault();
      const focusableElements = this.getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  };
}

/**
 * Create and manage a focus trap
 */
export function createFocusTrap(element: HTMLElement): FocusTrap {
  return new FocusTrap(element);
}

/**
 * Move focus to element with announcement
 */
export function moveFocusTo(
  element: HTMLElement,
  announce = true,
  message?: string
): void {
  element.focus();

  if (announce) {
    const defaultMessage = `Focus moved to ${
      element.getAttribute('aria-label') ||
      element.textContent ||
      element.tagName.toLowerCase()
    }`;
    announceToScreenReader(message || defaultMessage);
  }
}

/**
 * Focus the first focusable element in container
 */
export function focusFirstFocusable(container: HTMLElement): HTMLElement | null {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
    return focusableElements[0];
  }
  return null;
}

/**
 * Get all focusable elements in container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(',');

  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors)
  ).filter(element => {
    return (
      element.offsetParent !== null &&
      !element.hasAttribute('hidden') &&
      getComputedStyle(element).visibility !== 'hidden'
    );
  });
}

// =============================================================================
// ARIA HELPERS
// =============================================================================

/**
 * Generate unique ID for ARIA relationships
 */
export function generateId(prefix = 'roko'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Set ARIA attributes safely
 */
export function setAriaAttributes(
  element: HTMLElement,
  attributes: Record<string, string | boolean | number>
): void {
  Object.entries(attributes).forEach(([key, value]) => {
    const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`;
    element.setAttribute(ariaKey, String(value));
  });
}

/**
 * Remove ARIA attributes
 */
export function removeAriaAttributes(
  element: HTMLElement,
  attributes: string[]
): void {
  attributes.forEach(attr => {
    const ariaKey = attr.startsWith('aria-') ? attr : `aria-${attr}`;
    element.removeAttribute(ariaKey);
  });
}

/**
 * Create ARIA live region for announcements
 */
export function createLiveRegion(
  politeness: 'polite' | 'assertive' = 'polite'
): HTMLElement {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', politeness);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-10000px';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.overflow = 'hidden';

  document.body.appendChild(liveRegion);
  return liveRegion;
}

/**
 * Global live region for announcements
 */
let globalLiveRegion: HTMLElement | null = null;

/**
 * Get or create global live region
 */
function getGlobalLiveRegion(): HTMLElement {
  if (!globalLiveRegion) {
    globalLiveRegion = createLiveRegion();
  }
  return globalLiveRegion;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
): void {
  if (!message.trim()) return;

  const liveRegion = getGlobalLiveRegion();
  liveRegion.setAttribute('aria-live', politeness);

  // Clear and set message
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);

  // Clear message after announcement
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 3000);
}

/**
 * Create ARIA describedby relationship
 */
export function createDescribedBy(
  element: HTMLElement,
  descriptionElement: HTMLElement,
  prefix = 'description'
): string {
  const id = descriptionElement.id || generateId(prefix);
  descriptionElement.id = id;

  const existingDescribedBy = element.getAttribute('aria-describedby');
  const describedByList = existingDescribedBy
    ? existingDescribedBy.split(' ')
    : [];

  if (!describedByList.includes(id)) {
    describedByList.push(id);
    element.setAttribute('aria-describedby', describedByList.join(' '));
  }

  return id;
}

/**
 * Create ARIA labelledby relationship
 */
export function createLabelledBy(
  element: HTMLElement,
  labelElement: HTMLElement,
  prefix = 'label'
): string {
  const id = labelElement.id || generateId(prefix);
  labelElement.id = id;

  const existingLabelledBy = element.getAttribute('aria-labelledby');
  const labelledByList = existingLabelledBy
    ? existingLabelledBy.split(' ')
    : [];

  if (!labelledByList.includes(id)) {
    labelledByList.push(id);
    element.setAttribute('aria-labelledby', labelledByList.join(' '));
  }

  return id;
}

// =============================================================================
// KEYBOARD NAVIGATION
// =============================================================================

/**
 * Keyboard navigation directions
 */
export enum NavigationDirection {
  Up = 'ArrowUp',
  Down = 'ArrowDown',
  Left = 'ArrowLeft',
  Right = 'ArrowRight',
  Home = 'Home',
  End = 'End',
  PageUp = 'PageUp',
  PageDown = 'PageDown',
  Tab = 'Tab',
  Escape = 'Escape',
  Enter = 'Enter',
  Space = ' ',
}

/**
 * Navigation options
 */
export interface NavigationOptions {
  wrap?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'both';
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

/**
 * Keyboard navigation handler
 */
export class KeyboardNavigationHandler {
  private elements: HTMLElement[] = [];
  private currentIndex = -1;
  private options: NavigationOptions;

  constructor(
    elements: HTMLElement[],
    options: NavigationOptions = {}
  ) {
    this.elements = elements;
    this.options = {
      wrap: true,
      orientation: 'both',
      preventDefault: true,
      stopPropagation: false,
      ...options,
    };
  }

  /**
   * Update the list of navigable elements
   */
  updateElements(elements: HTMLElement[]): void {
    this.elements = elements;
    this.currentIndex = Math.min(this.currentIndex, elements.length - 1);
  }

  /**
   * Set current focus index
   */
  setCurrentIndex(index: number): void {
    if (index >= 0 && index < this.elements.length) {
      this.currentIndex = index;
    }
  }

  /**
   * Get current focus index
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyDown = (event: KeyboardEvent): boolean => {
    const { key } = event;
    const { orientation, preventDefault, stopPropagation } = this.options;

    let handled = false;
    let newIndex = this.currentIndex;

    // Navigation keys
    switch (key) {
      case NavigationDirection.Up:
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = this.getPreviousIndex();
          handled = true;
        }
        break;

      case NavigationDirection.Down:
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = this.getNextIndex();
          handled = true;
        }
        break;

      case NavigationDirection.Left:
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = this.getPreviousIndex();
          handled = true;
        }
        break;

      case NavigationDirection.Right:
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = this.getNextIndex();
          handled = true;
        }
        break;

      case NavigationDirection.Home:
        newIndex = 0;
        handled = true;
        break;

      case NavigationDirection.End:
        newIndex = this.elements.length - 1;
        handled = true;
        break;

      case NavigationDirection.PageUp:
        newIndex = Math.max(0, this.currentIndex - 10);
        handled = true;
        break;

      case NavigationDirection.PageDown:
        newIndex = Math.min(this.elements.length - 1, this.currentIndex + 10);
        handled = true;
        break;
    }

    if (handled) {
      if (preventDefault) event.preventDefault();
      if (stopPropagation) event.stopPropagation();

      this.focusIndex(newIndex);
      return true;
    }

    return false;
  };

  /**
   * Focus element at index
   */
  focusIndex(index: number): void {
    if (index >= 0 && index < this.elements.length) {
      this.currentIndex = index;
      this.elements[index].focus();
    }
  }

  /**
   * Get next valid index
   */
  private getNextIndex(): number {
    const { wrap } = this.options;
    const nextIndex = this.currentIndex + 1;

    if (nextIndex >= this.elements.length) {
      return wrap ? 0 : this.currentIndex;
    }

    return nextIndex;
  }

  /**
   * Get previous valid index
   */
  private getPreviousIndex(): number {
    const { wrap } = this.options;
    const prevIndex = this.currentIndex - 1;

    if (prevIndex < 0) {
      return wrap ? this.elements.length - 1 : this.currentIndex;
    }

    return prevIndex;
  }
}

/**
 * Create keyboard navigation handler
 */
export function createKeyboardNavigation(
  elements: HTMLElement[],
  options?: NavigationOptions
): KeyboardNavigationHandler {
  return new KeyboardNavigationHandler(elements, options);
}

// =============================================================================
// ROVING TABINDEX
// =============================================================================

/**
 * Roving tabindex manager for complex widgets
 */
export class RovingTabindexManager {
  private elements: HTMLElement[] = [];
  private currentIndex = 0;

  constructor(elements: HTMLElement[]) {
    this.elements = elements;
    this.updateTabindices();
  }

  /**
   * Update elements and reset tabindices
   */
  updateElements(elements: HTMLElement[]): void {
    this.elements = elements;
    this.currentIndex = Math.min(this.currentIndex, elements.length - 1);
    this.updateTabindices();
  }

  /**
   * Set focus to specific index
   */
  setFocus(index: number): void {
    if (index >= 0 && index < this.elements.length) {
      this.currentIndex = index;
      this.updateTabindices();
      this.elements[index].focus();
    }
  }

  /**
   * Move focus to next element
   */
  next(wrap = true): void {
    const nextIndex = this.currentIndex + 1;
    if (nextIndex >= this.elements.length) {
      this.setFocus(wrap ? 0 : this.currentIndex);
    } else {
      this.setFocus(nextIndex);
    }
  }

  /**
   * Move focus to previous element
   */
  previous(wrap = true): void {
    const prevIndex = this.currentIndex - 1;
    if (prevIndex < 0) {
      this.setFocus(wrap ? this.elements.length - 1 : this.currentIndex);
    } else {
      this.setFocus(prevIndex);
    }
  }

  /**
   * Update tabindex attributes
   */
  private updateTabindices(): void {
    this.elements.forEach((element, index) => {
      element.tabIndex = index === this.currentIndex ? 0 : -1;
    });
  }
}

/**
 * Create roving tabindex manager
 */
export function createRovingTabindex(elements: HTMLElement[]): RovingTabindexManager {
  return new RovingTabindexManager(elements);
}

// =============================================================================
// SCREEN READER UTILITIES
// =============================================================================

/**
 * Check if screen reader is likely active
 */
export function isScreenReaderActive(): boolean {
  // This is a heuristic and not 100% reliable
  return (
    typeof window !== 'undefined' &&
    (window.navigator.userAgent.includes('NVDA') ||
      window.navigator.userAgent.includes('JAWS') ||
      window.speechSynthesis?.speaking === true ||
      document.activeElement?.getAttribute('role') === 'application')
  );
}

/**
 * Create screen reader only text
 */
export function createSROnlyText(text: string): HTMLElement {
  const element = document.createElement('span');
  element.className = 'sr-only';
  element.textContent = text;
  return element;
}

/**
 * Update screen reader text
 */
export function updateSRText(element: HTMLElement, text: string): void {
  const srElement = element.querySelector('.sr-only');
  if (srElement) {
    srElement.textContent = text;
  } else {
    element.appendChild(createSROnlyText(text));
  }
}

// =============================================================================
// ACCESSIBILITY VALIDATION
// =============================================================================

/**
 * Validate color contrast ratio
 */
export function validateColorContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): { passes: boolean; ratio: number; required: number } {
  const ratio = calculateContrastRatio(foreground, background);
  const required = level === 'AAA' ? 7 : 4.5;

  return {
    passes: ratio >= required,
    ratio,
    required,
  };
}

/**
 * Calculate color contrast ratio
 */
function calculateContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Get relative luminance of color
 */
function getRelativeLuminance(color: string): number {
  const rgb = parseColor(color);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map(c => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Parse color string to RGB values
 */
function parseColor(color: string): [number, number, number] | null {
  const div = document.createElement('div');
  div.style.color = color;
  document.body.appendChild(div);

  const computedColor = getComputedStyle(div).color;
  document.body.removeChild(div);

  const match = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }

  return null;
}

/**
 * Check if element has accessible name
 */
export function hasAccessibleName(element: HTMLElement): boolean {
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  const title = element.getAttribute('title');
  const altText = element.getAttribute('alt');

  if (ariaLabel || title || altText) return true;

  if (ariaLabelledBy) {
    const labelElements = ariaLabelledBy
      .split(' ')
      .map(id => document.getElementById(id))
      .filter(Boolean);

    return labelElements.some(el => el?.textContent?.trim());
  }

  // Check for label element
  if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
    const id = element.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label?.textContent?.trim()) return true;
    }
  }

  // Check for text content
  return Boolean(element.textContent?.trim());
}

// =============================================================================
// ACCESSIBILITY HOOKS (React-specific)
// =============================================================================

/**
 * React hook for managing focus trap
 */
export function useFocusTrap(
  ref: React.RefObject<HTMLElement>,
  active: boolean
): void {
  React.useEffect(() => {
    if (!ref.current || !active) return;

    const focusTrap = createFocusTrap(ref.current);
    focusTrap.activate();

    return () => {
      focusTrap.deactivate();
    };
  }, [ref, active]);
}

/**
 * React hook for keyboard navigation
 */
export function useKeyboardNavigation(
  ref: React.RefObject<HTMLElement>,
  selector: string,
  options?: NavigationOptions
): void {
  React.useEffect(() => {
    if (!ref.current) return;

    const elements = Array.from(
      ref.current.querySelectorAll<HTMLElement>(selector)
    );

    const navigation = createKeyboardNavigation(elements, options);
    ref.current.addEventListener('keydown', navigation.handleKeyDown);

    return () => {
      ref.current?.removeEventListener('keydown', navigation.handleKeyDown);
    };
  }, [ref, selector, options]);
}

/**
 * React hook for ARIA live announcements
 */
export function useAnnouncer(): (message: string, politeness?: 'polite' | 'assertive') => void {
  return React.useCallback((message: string, politeness?: 'polite' | 'assertive') => {
    announceToScreenReader(message, politeness);
  }, []);
}

// =============================================================================
// EXPORTS
// =============================================================================

export * from './accessibility';

// Ensure React is available for hooks
declare global {
  namespace React {
    function useEffect(effect: () => void | (() => void), deps?: any[]): void;
    function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
    interface RefObject<T> {
      readonly current: T | null;
    }
  }
}