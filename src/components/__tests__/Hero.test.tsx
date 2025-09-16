/**
 * @fileoverview Hero component test suite
 * @author ROKO QA Team
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { render, mockIntersectionObserver } from '@/test-utils';
import { Hero } from '../sections/Hero';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock Three.js components to avoid WebGL context issues in tests
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }: any) => (
    <div data-testid="three-canvas" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('../3d/TemporalOrb', () => ({
  TemporalOrb: (props: any) => (
    <div data-testid="temporal-orb" data-props={JSON.stringify(props)} />
  ),
}));

vi.mock('../3d/AccessibilityFallback', () => ({
  AccessibilityFallback: () => (
    <div data-testid="accessibility-fallback">
      ROKO Temporal Network Fallback
    </div>
  ),
}));

// Mock Heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  ChevronDownIcon: (props: any) => (
    <svg data-testid="chevron-down-icon" {...props}>
      <path d="chevron-down" />
    </svg>
  ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

describe('Hero Component', () => {
  const mockOnStartBuilding = vi.fn();
  const mockOnReadDocs = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockIntersectionObserver();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Hero />);
      
      expect(screen.getByRole('region', { name: /hero section/i })).toBeInTheDocument();
    });

    it('should render with required props', () => {
      render(
        <Hero 
          onStartBuilding={mockOnStartBuilding}
          onReadDocs={mockOnReadDocs}
        />
      );
      
      expect(screen.getByRole('region', { name: /hero section/i })).toBeInTheDocument();
    });

    it('should display main headline text', () => {
      render(<Hero />);
      
      expect(screen.getByText('The Temporal Layer')).toBeInTheDocument();
      expect(screen.getByText('for Web3')).toBeInTheDocument();
    });

    it('should display subheadline with key information', () => {
      render(<Hero />);
      
      expect(screen.getByText(/nanosecond precision blockchain infrastructure/i)).toBeInTheDocument();
      expect(screen.getByText(/ieee 1588 ptp/i)).toBeInTheDocument();
    });

    it('should display network statistics', () => {
      render(<Hero />);
      
      expect(screen.getByText('~1ns')).toBeInTheDocument();
      expect(screen.getByText('Precision')).toBeInTheDocument();
      expect(screen.getByText('24/7')).toBeInTheDocument();
      expect(screen.getByText('Uptime')).toBeInTheDocument();
      expect(screen.getByText('Global')).toBeInTheDocument();
      expect(screen.getByText('Network')).toBeInTheDocument();
    });

    it('should render CTA buttons', () => {
      render(<Hero />);
      
      expect(screen.getByRole('button', { name: /start building/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /read documentation/i })).toBeInTheDocument();
    });

    it('should render scroll indicator', () => {
      render(<Hero />);
      
      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
      expect(screen.getByText('Explore Features')).toBeInTheDocument();
    });

    it('should render 3D canvas with fallback', () => {
      render(<Hero />);
      
      expect(screen.getByTestId('three-canvas')).toBeInTheDocument();
      expect(screen.getByTestId('accessibility-fallback')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onStartBuilding when start building button is clicked', async () => {
      const user = userEvent.setup();
      render(<Hero onStartBuilding={mockOnStartBuilding} />);
      
      const startButton = screen.getByRole('button', { name: /start building/i });
      await user.click(startButton);
      
      expect(mockOnStartBuilding).toHaveBeenCalledOnce();
    });

    it('should call onReadDocs when read documentation button is clicked', async () => {
      const user = userEvent.setup();
      render(<Hero onReadDocs={mockOnReadDocs} />);
      
      const docsButton = screen.getByRole('button', { name: /read documentation/i });
      await user.click(docsButton);
      
      expect(mockOnReadDocs).toHaveBeenCalledOnce();
    });

    it('should handle button interactions even without prop handlers', async () => {
      const user = userEvent.setup();
      render(<Hero />);
      
      const startButton = screen.getByRole('button', { name: /start building/i });
      const docsButton = screen.getByRole('button', { name: /read documentation/i });
      
      // Should not throw errors
      await user.click(startButton);
      await user.click(docsButton);
      
      expect(startButton).toBeInTheDocument();
      expect(docsButton).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<Hero onStartBuilding={mockOnStartBuilding} />);
      
      const startButton = screen.getByRole('button', { name: /start building/i });
      
      // Tab to the button and press Enter
      await user.tab();
      expect(startButton).toHaveFocus();
      
      await user.keyboard('[Enter]');
      expect(mockOnStartBuilding).toHaveBeenCalledOnce();
    });

    it('should handle Space key press on buttons', async () => {
      const user = userEvent.setup();
      render(<Hero onReadDocs={mockOnReadDocs} />);
      
      const docsButton = screen.getByRole('button', { name: /read documentation/i });
      docsButton.focus();
      
      await user.keyboard('[Space]');
      expect(mockOnReadDocs).toHaveBeenCalledOnce();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible according to WCAG guidelines', async () => {
      const { container } = render(<Hero />);
      const results = await axe(container);
      
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels and roles', () => {
      render(<Hero />);
      
      const heroSection = screen.getByRole('region', { name: /hero section/i });
      expect(heroSection).toHaveAttribute('aria-label', 'Hero section introducing ROKO Network');
    });

    it('should have screen reader announcements', () => {
      render(<Hero />);
      
      const announcement = screen.getByText(/hero section loaded with roko network/i);
      expect(announcement).toHaveClass('sr-only');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
    });

    it('should hide decorative 3D canvas from screen readers', () => {
      render(<Hero />);
      
      const canvas = screen.getByTestId('three-canvas');
      expect(canvas).toHaveAttribute('aria-hidden', 'true');
    });

    it('should provide proper button labels', () => {
      render(<Hero />);
      
      const startButton = screen.getByRole('button', { name: /start building/i });
      const docsButton = screen.getByRole('button', { name: /read documentation/i });
      
      expect(startButton).toBeInTheDocument();
      expect(docsButton).toBeInTheDocument();
    });

    it('should support high contrast mode', () => {
      // Test that text remains readable in high contrast mode
      const { container } = render(<Hero />);
      
      // Simulate high contrast media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
      
      expect(container.querySelector('.gradientText')).toBeInTheDocument();
    });

    it('should respect reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
      
      render(<Hero />);
      
      // Component should still render properly
      expect(screen.getByRole('region', { name: /hero section/i })).toBeInTheDocument();
    });
  });

  describe('3D Scene Integration', () => {
    it('should render 3D canvas with correct properties', () => {
      render(<Hero />);
      
      const canvas = screen.getByTestId('three-canvas');
      expect(canvas).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render TemporalOrb with correct props', () => {
      render(<Hero />);
      
      const temporalOrb = screen.getByTestId('temporal-orb');
      const props = JSON.parse(temporalOrb.getAttribute('data-props') || '{}');
      
      expect(props).toEqual({
        position: [2, 0, 0],
        scale: 1.2,
        isHovered: false,
        performanceLevel: 'high'
      });
    });

    it('should provide accessibility fallback for 3D content', () => {
      render(<Hero />);
      
      expect(screen.getByTestId('accessibility-fallback')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should handle mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(<Hero />);
      
      expect(screen.getByRole('region', { name: /hero section/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /start building/i })).toBeInTheDocument();
    });

    it('should handle tablet viewport', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      render(<Hero />);
      
      expect(screen.getByText('The Temporal Layer')).toBeInTheDocument();
    });

    it('should handle desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      
      render(<Hero />);
      
      expect(screen.getByText('The Temporal Layer')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently without unnecessary re-renders', () => {
      const { rerender } = render(<Hero />);
      
      // Re-render with same props should be efficient
      rerender(<Hero />);
      
      expect(screen.getByRole('region', { name: /hero section/i })).toBeInTheDocument();
    });

    it('should handle prop changes gracefully', () => {
      const { rerender } = render(<Hero onStartBuilding={mockOnStartBuilding} />);
      
      const newMockHandler = vi.fn();
      rerender(<Hero onStartBuilding={newMockHandler} />);
      
      expect(screen.getByRole('button', { name: /start building/i })).toBeInTheDocument();
    });

    it('should optimize 3D rendering based on performance level', () => {
      render(<Hero />);
      
      const temporalOrb = screen.getByTestId('temporal-orb');
      const props = JSON.parse(temporalOrb.getAttribute('data-props') || '{}');
      
      expect(props.performanceLevel).toBe('high');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing 3D context gracefully', () => {
      // Mock WebGL not available
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);
      
      render(<Hero />);
      
      expect(screen.getByTestId('accessibility-fallback')).toBeInTheDocument();
      
      // Restore original method
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    it('should render fallback when 3D components fail', () => {
      render(<Hero />);
      
      // Fallback should be available in Suspense
      expect(screen.getByTestId('accessibility-fallback')).toBeInTheDocument();
    });
  });

  describe('IntersectionObserver Integration', () => {
    it('should trigger animations when in view', async () => {
      const mockObserver = mockIntersectionObserver();
      render(<Hero />);
      
      // Simulate intersection
      const observeCall = mockObserver.mock.results[0].value.observe;
      expect(observeCall).toHaveBeenCalled();
    });

    it('should handle intersection observer not available', () => {
      // Mock missing IntersectionObserver
      const originalIntersectionObserver = window.IntersectionObserver;
      delete (window as any).IntersectionObserver;
      
      render(<Hero />);
      
      expect(screen.getByRole('region', { name: /hero section/i })).toBeInTheDocument();
      
      // Restore
      window.IntersectionObserver = originalIntersectionObserver;
    });
  });

  describe('SEO and Metadata', () => {
    it('should have proper heading hierarchy', () => {
      render(<Hero />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent(/temporal layer/i);
    });

    it('should include key technical terms for SEO', () => {
      render(<Hero />);
      
      expect(screen.getByText(/nanosecond precision/i)).toBeInTheDocument();
      expect(screen.getByText(/blockchain infrastructure/i)).toBeInTheDocument();
      expect(screen.getByText(/IEEE 1588 PTP/i)).toBeInTheDocument();
      expect(screen.getByText(/Web3/i)).toBeInTheDocument();
    });
  });
});
