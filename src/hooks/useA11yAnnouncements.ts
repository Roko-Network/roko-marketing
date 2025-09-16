import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Accessibility Announcements Hook
 *
 * Provides screen reader announcements for route changes and dynamic content updates.
 * Helps maintain accessibility for users with assistive technologies.
 */
export const useA11yAnnouncements = () => {
  const location = useLocation();

  // Function to announce messages to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.getElementById('announcements');
    if (!announcer) return;

    // Clear previous announcement
    announcer.textContent = '';
    announcer.setAttribute('aria-live', priority);

    // Add new announcement with a slight delay to ensure it's read
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);

    // Clear the announcement after it's been read
    setTimeout(() => {
      announcer.textContent = '';
    }, 3000);
  }, []);

  // Announce route changes
  useEffect(() => {
    const getPageTitle = (pathname: string): string => {
      // Map routes to user-friendly titles
      const routeTitles: Record<string, string> = {
        '/': 'Home page',
        '/technology': 'Technology page',
        '/governance': 'Governance page',
        '/developers': 'Developers page',
        '/ecosystem': 'Ecosystem page',
        '/about': 'About page',
        '/contact': 'Contact page',
        '/careers': 'Careers page',
        '/blog': 'Blog page',
        '/legal': 'Legal page',
        '/privacy': 'Privacy Policy page',
        '/terms': 'Terms of Service page',
        '/cookies': 'Cookie Policy page',
      };

      return routeTitles[pathname] || `${pathname.slice(1)} page`;
    };

    const pageTitle = getPageTitle(location.pathname);
    announce(`Navigated to ${pageTitle}`, 'polite');
  }, [location.pathname, announce]);

  // Function to announce loading states
  const announceLoading = useCallback((isLoading: boolean, context?: string) => {
    const message = isLoading
      ? `Loading${context ? ` ${context}` : ''}...`
      : `Content${context ? ` ${context}` : ''} loaded`;

    announce(message, 'polite');
  }, [announce]);

  // Function to announce errors
  const announceError = useCallback((error: string) => {
    announce(`Error: ${error}`, 'assertive');
  }, [announce]);

  // Function to announce success messages
  const announceSuccess = useCallback((message: string) => {
    announce(`Success: ${message}`, 'polite');
  }, [announce]);

  // Function to announce form validation errors
  const announceFormError = useCallback((fieldName: string, error: string) => {
    announce(`${fieldName} field error: ${error}`, 'assertive');
  }, [announce]);

  // Function to announce dynamic content changes
  const announceContentChange = useCallback((description: string) => {
    announce(`Content updated: ${description}`, 'polite');
  }, [announce]);

  // Function to announce modal/dialog states
  const announceModal = useCallback((isOpen: boolean, title?: string) => {
    const message = isOpen
      ? `${title || 'Dialog'} opened`
      : `${title || 'Dialog'} closed`;

    announce(message, 'polite');
  }, [announce]);

  // Function to announce search results
  const announceSearchResults = useCallback((count: number, query?: string) => {
    const message = query
      ? `Found ${count} results for "${query}"`
      : `Found ${count} results`;

    announce(message, 'polite');
  }, [announce]);

  // Function to announce pagination changes
  const announcePagination = useCallback((currentPage: number, totalPages: number) => {
    announce(`Page ${currentPage} of ${totalPages}`, 'polite');
  }, [announce]);

  // Listen for focus trap events (modal/dropdown opening)
  useEffect(() => {
    const handleFocusTrap = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.announcement) {
        announce(customEvent.detail.announcement, customEvent.detail.priority || 'polite');
      }
    };

    document.addEventListener('focustrap:announce', handleFocusTrap);

    return () => {
      document.removeEventListener('focustrap:announce', handleFocusTrap);
    };
  }, [announce]);

  // Listen for custom announcement events
  useEffect(() => {
    const handleCustomAnnouncement = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.message) {
        announce(customEvent.detail.message, customEvent.detail.priority || 'polite');
      }
    };

    document.addEventListener('a11y:announce', handleCustomAnnouncement);

    return () => {
      document.removeEventListener('a11y:announce', handleCustomAnnouncement);
    };
  }, [announce]);

  return {
    announce,
    announceLoading,
    announceError,
    announceSuccess,
    announceFormError,
    announceContentChange,
    announceModal,
    announceSearchResults,
    announcePagination,
  };
};