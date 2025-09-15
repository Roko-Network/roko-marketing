import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { HeroSection } from '@/components/HeroSection';

// US-1.1: Homepage Hero Section Tests
describe('HeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should display hero content within 1 second', async () => {
      const startTime = performance.now();
      render(<HeroSection />);

      await waitFor(() => {
        expect(screen.getByText('The Temporal Layer for Web3')).toBeInTheDocument();
      });

      const loadTime = performance.now() - startTime;
      expect(loadTime).toBeLessThan(1000);
    });

    it('should render headline text correctly', () => {
      render(<HeroSection />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'The Temporal Layer for Web3'
      );
    });

    it('should display three CTAs', () => {
      render(<HeroSection />);
      expect(screen.getByRole('link', { name: /start building/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view docs/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /join network/i })).toBeInTheDocument();
    });

    it('should show animated timeline visualization', () => {
      render(<HeroSection />);
      const timeline = screen.getByTestId('timeline-visualization');
      expect(timeline).toBeInTheDocument();
      expect(timeline).toHaveClass('timeline-animated');
    });
  });

  describe('Network Stats', () => {
    it('should display live network stats', () => {
      render(<HeroSection />);
      expect(screen.getByTestId('validator-count')).toBeInTheDocument();
      expect(screen.getByTestId('block-time')).toBeInTheDocument();
      expect(screen.getByTestId('sync-accuracy')).toBeInTheDocument();
    });

    it('should update network stats every 5 seconds', async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ validators: 100, blockTime: 2.1, accuracy: 99.99 })
      }).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ validators: 101, blockTime: 2.0, accuracy: 99.98 })
      });

      global.fetch = mockFetch;

      render(<HeroSection />);

      // Initial stats
      await waitFor(() => {
        expect(screen.getByTestId('validator-count')).toHaveTextContent('100');
      });

      // Wait for update
      await waitFor(() => {
        expect(screen.getByTestId('validator-count')).toHaveTextContent('101');
      }, { timeout: 6000 });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Interactions', () => {
    it('should navigate to correct destination when CTAs are clicked', async () => {
      const user = userEvent.setup();
      const mockNavigate = vi.fn();

      render(<HeroSection navigate={mockNavigate} />);

      await user.click(screen.getByRole('link', { name: /start building/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/developers/quick-start');

      await user.click(screen.getByRole('link', { name: /view docs/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/developers');

      await user.click(screen.getByRole('link', { name: /join network/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/ecosystem/validators');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<HeroSection />);
      expect(screen.getByRole('region', { name: /hero/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/network statistics/i)).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<HeroSection />);

      await user.tab();
      expect(screen.getByRole('link', { name: /start building/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('link', { name: /view docs/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('link', { name: /join network/i })).toHaveFocus();
    });

    it('should respect prefers-reduced-motion', () => {
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      render(<HeroSection />);
      const timeline = screen.getByTestId('timeline-visualization');
      expect(timeline).not.toHaveClass('timeline-animated');
    });
  });

  describe('Performance', () => {
    it('should render efficiently without unnecessary re-renders', () => {
      const renderSpy = vi.fn();
      render(<HeroSection onRender={renderSpy} />);

      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should lazy load non-critical assets', () => {
      render(<HeroSection />);
      const backgroundImage = screen.getByTestId('hero-background');
      expect(backgroundImage).toHaveAttribute('loading', 'lazy');
    });
  });
});