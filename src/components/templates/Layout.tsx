import { FC, memo, ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ErrorBoundary from '../organisms/ErrorBoundary';
import { Header } from '../organisms/Header';
import { Footer } from '../organisms/Footer';
import { useWebVitals } from '../../hooks/useWebVitals';
import { useA11yAnnouncements } from '../../hooks/useA11yAnnouncements';
import styles from './Layout.module.css';

export interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
  jsonLd?: object;
  className?: string;
}

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
  jsonLd?: object;
}

/**
 * SEO Component
 *
 * Handles all meta tags, structured data, and SEO optimization
 */
const SEO: FC<SEOProps> = memo(({
  title,
  description,
  keywords,
  image,
  noIndex = false,
  canonicalUrl,
  jsonLd
}) => {
  const location = useLocation();

  useEffect(() => {
    const currentUrl = `${window.location.origin}${location.pathname}`;

    // Default values
    const defaultTitle = 'ROKO Network - The Temporal Layer for Web3';
    const defaultDescription = 'ROKO Network delivers nanosecond precision blockchain infrastructure with temporal synchronization for the next generation of Web3 applications.';
    const defaultImage = '/images/og-image.jpg';
    const defaultKeywords = 'blockchain, temporal, nanosecond, precision, web3, infrastructure, synchronization, defi, crypto';

    // Construct final values
    const pageTitle = title ? `${title} | ROKO Network` : defaultTitle;
    const pageDescription = description || defaultDescription;
    const pageImage = image || defaultImage;
    const pageKeywords = keywords || defaultKeywords;
    const pageCanonical = canonicalUrl || currentUrl;

    // Update document title
    document.title = pageTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update link tags
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Basic meta tags
    updateMetaTag('description', pageDescription);
    updateMetaTag('keywords', pageKeywords);

    // Robots
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.remove();
      }
    }

    // Canonical URL
    updateLinkTag('canonical', pageCanonical);

    // Open Graph
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:title', pageTitle, true);
    updateMetaTag('og:description', pageDescription, true);
    updateMetaTag('og:image', pageImage, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:site_name', 'ROKO Network', true);

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', '@rokonetwork');
    updateMetaTag('twitter:creator', '@rokonetwork');
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', pageDescription);
    updateMetaTag('twitter:image', pageImage);

    // Additional SEO
    updateMetaTag('theme-color', '#00d4aa');
    updateMetaTag('msapplication-TileColor', '#0078D4');

    // Structured Data
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }
  }, [title, description, keywords, image, noIndex, canonicalUrl, jsonLd, location.pathname]);

  return null;
});

SEO.displayName = 'SEO';

/**
 * Layout Component
 *
 * Main layout wrapper with Header, Footer, SEO, error boundaries,
 * and performance monitoring. Provides consistent page structure
 * and accessibility features.
 */
export const Layout: FC<LayoutProps> = memo(({
  children,
  title,
  description,
  keywords,
  image,
  noIndex,
  canonicalUrl,
  jsonLd,
  className
}) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Initialize Web Vitals monitoring
  useWebVitals();

  // Initialize accessibility announcements
  useA11yAnnouncements();

  // Handle scroll detection for background opacity
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Update page focus for screen readers
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }, [location.pathname]);

  // Simplified page transition for smooth routing without double animations
  const pageVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: 'easeIn',
      },
    },
  };

  return (
    <div className={`${styles.layout} ${isScrolled ? styles.scrolled : ''}`}>
      {/* SEO and Meta Tags */}
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        image={image}
        noIndex={noIndex}
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />

      {/* Skip Links for Accessibility */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <a href="#footer" className={styles.skipLink}>
        Skip to footer
      </a>

      {/* Live Region for Screen Reader Announcements */}
      <div
        id="announcements"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      />

      {/* Header */}
      <ErrorBoundary
        fallback={
          <div className={styles.errorFallback}>
            <p>Navigation temporarily unavailable</p>
          </div>
        }
      >
        <Header />
      </ErrorBoundary>

      {/* Main Content */}
      <ErrorBoundary
        fallback={
          <div className={styles.errorFallback}>
            <h1>Something went wrong</h1>
            <p>We're sorry, but there was an error loading this page.</p>
            <button
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Reload Page
            </button>
          </div>
        }
      >
        <main
          id="main-content"
          className={styles.main}
          role="main"
          tabIndex={-1}
          aria-label="Main content"
          style={{
            background: '#FFFFFF'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className={className}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{
                background: '#FFFFFF',
                position: 'relative',
                minHeight: '100vh',
              }}
            >
              {/* Removed decorative elements for flat design */}

              {/* Content wrapper */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </ErrorBoundary>

      {/* Footer */}
      <ErrorBoundary
        fallback={
          <div className={styles.errorFallback}>
            <p>Footer temporarily unavailable</p>
          </div>
        }
      >
        <Footer />
      </ErrorBoundary>
    </div>
  );
});

Layout.displayName = 'Layout';