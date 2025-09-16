import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Navigation } from '@/components/molecules/Navigation';

// US-1.2: Navigation System Tests
describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollY = 0;
  });

  describe('Rendering', () => {
    it('should render all navigation items', () => {
      render(<Navigation />);

      expect(screen.getByRole('link', { name: /platform/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /technology/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /solutions/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /developers/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /ecosystem/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /resources/i })).toBeInTheDocument();
    });

    it('should display logo', () => {
      render(<Navigation />);
      expect(screen.getByRole('img', { name: /roko network logo/i })).toBeInTheDocument();
    });
  });

  describe('Sticky Behavior', () => {
    it('should remain sticky on scroll', () => {
      render(<Navigation />);
      const nav = screen.getByRole('navigation');

      expect(nav).toHaveStyle({ position: 'fixed' });

      // Simulate scroll
      window.scrollY = 500;
      fireEvent.scroll(window);

      expect(nav).toHaveStyle({ position: 'fixed' });
      expect(nav).toHaveClass('nav-sticky');
    });

    it('should add shadow on scroll', () => {
      render(<Navigation />);
      const nav = screen.getByRole('navigation');

      expect(nav).not.toHaveClass('nav-shadow');

      window.scrollY = 100;
      fireEvent.scroll(window);

      expect(nav).toHaveClass('nav-shadow');
    });
  });

  describe('Active Section Highlighting', () => {
    it('should highlight active section based on scroll position', () => {
      render(<Navigation />);

      // Mock section positions
      const mockGetBoundingClientRect = vi.fn();
      mockGetBoundingClientRect.mockReturnValue({ top: 50, bottom: 500 });

      const platformSection = document.createElement('div');
      platformSection.id = 'platform';
      platformSection.getBoundingClientRect = mockGetBoundingClientRect;
      document.body.appendChild(platformSection);

      fireEvent.scroll(window);

      expect(screen.getByRole('link', { name: /platform/i })).toHaveClass('nav-active');
    });

    it('should update active section on navigation click', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      await user.click(screen.getByRole('link', { name: /technology/i }));
      expect(screen.getByRole('link', { name: /technology/i })).toHaveClass('nav-active');
    });
  });

  describe('Mobile Menu', () => {
    beforeEach(() => {
      // Mock mobile viewport
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
    });

    it('should render hamburger menu on mobile', () => {
      render(<Navigation />);
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    });

    it('should toggle mobile menu', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const menuButton = screen.getByRole('button', { name: /menu/i });
      const mobileMenu = screen.getByTestId('mobile-menu');

      expect(mobileMenu).toHaveAttribute('aria-expanded', 'false');

      await user.click(menuButton);
      expect(mobileMenu).toHaveAttribute('aria-expanded', 'true');

      await user.click(menuButton);
      expect(mobileMenu).toHaveAttribute('aria-expanded', 'false');
    });

    it('should close mobile menu on link click', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);

      const mobileMenu = screen.getByTestId('mobile-menu');
      expect(mobileMenu).toHaveAttribute('aria-expanded', 'true');

      await user.click(screen.getByRole('link', { name: /platform/i }));
      expect(mobileMenu).toHaveAttribute('aria-expanded', 'false');
    });

    it('should trap focus in mobile menu when open', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      await user.click(screen.getByRole('button', { name: /menu/i }));

      const firstLink = screen.getByRole('link', { name: /platform/i });
      const lastLink = screen.getByRole('link', { name: /resources/i });

      firstLink.focus();
      expect(firstLink).toHaveFocus();

      await user.tab({ shift: true });
      expect(lastLink).toHaveFocus();
    });
  });

  describe('Smooth Scrolling', () => {
    it('should smoothly scroll to sections', async () => {
      const scrollToSpy = vi.fn();
      window.scrollTo = scrollToSpy;

      const user = userEvent.setup();
      render(<Navigation />);

      // Create target section
      const section = document.createElement('div');
      section.id = 'technology';
      Object.defineProperty(section, 'offsetTop', { value: 1000, configurable: true });
      document.body.appendChild(section);

      await user.click(screen.getByRole('link', { name: /technology/i }));

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: expect.any(Number),
        behavior: 'smooth'
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      await user.tab();
      expect(screen.getByRole('img', { name: /roko network logo/i }).parentElement).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('link', { name: /platform/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('link', { name: /technology/i })).toHaveFocus();
    });

    it('should handle arrow key navigation', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      screen.getByRole('link', { name: /platform/i }).focus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('link', { name: /technology/i })).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('link', { name: /platform/i })).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Navigation />);

      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation');
      expect(screen.getByRole('list')).toHaveAttribute('role', 'menubar');
    });

    it('should announce current page', () => {
      render(<Navigation currentPage="technology" />);

      const techLink = screen.getByRole('link', { name: /technology/i });
      expect(techLink).toHaveAttribute('aria-current', 'page');
    });

    it('should have skip navigation link', () => {
      render(<Navigation />);

      const skipLink = screen.getByRole('link', { name: /skip to main content/i });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveClass('sr-only', 'focus:not-sr-only');
    });
  });

  describe('Performance', () => {
    it('should debounce scroll events', async () => {
      const handleScroll = vi.fn();
      render(<Navigation onScroll={handleScroll} />);

      // Fire multiple scroll events
      for (let i = 0; i < 10; i++) {
        fireEvent.scroll(window);
      }

      // Should only be called once due to debouncing
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(handleScroll).toHaveBeenCalledTimes(1);
    });
  });
});