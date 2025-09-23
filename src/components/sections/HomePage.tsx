import { FC, useEffect, useCallback, Suspense, lazy } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Hero from './Hero';
import Features from './Features';
import Technology from './Technology';
import Governance from './Governance';
import Ecosystem from './Ecosystem';
import styles from './HomePage.module.css';

// Lazy load components for performance
const PerformanceMonitor = lazy(() => import('../atoms/PerformanceMonitor'));

interface HomePageProps {
  className?: string;
}

export const HomePage: FC<HomePageProps> = ({ className }) => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });


  // SEO and performance optimization
  useEffect(() => {
    // Preload critical resources
    const preloadResources = () => {
      // Preload critical images
      const criticalImages = [
        '/images/temporal-orb.webp',
        '/images/network-globe.webp',
        '/images/hero-background.webp'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });

      // Preload critical fonts
      const criticalFonts = [
        'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap'
      ];

      criticalFonts.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    preloadResources();

    // Intersection Observer for performance monitoring
    const observePerformance = () => {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // Track section views for analytics
                const sectionName = entry.target.getAttribute('data-section');
                if (sectionName) {
                  // Analytics tracking would go here
                  console.log(`Section viewed: ${sectionName}`);
                }
              }
            });
          },
          {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
          }
        );

        // Observe all sections
        const sections = document.querySelectorAll('[data-section]');
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
      }
      return () => {}; // No-op cleanup for unsupported browsers
    };

    const cleanup = observePerformance();
    return cleanup || (() => {});
  }, []);

  // Smooth scroll handler
  const handleSmoothScroll = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  // Parallax effect variants
  const parallaxVariants = {
    initial: { y: 0 },
    animate: {
      y: [-20, 20, -20],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className={`${styles.homePage} ${className || ''}`}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>ROKO Network - Temporal Blockchain Infrastructure with Time measuring precision</title>
        <meta
          name="description"
          content="Novel blockchain infrastructure combining hardware-grade timing measurement with enterprise-grade performance. Build time-critical Web3 applications with IEEE 1588 PTP synchronization."
        />
        <meta
          name="keywords"
          content="temporal blockchain, hardware timing infrastructure, Web3 infrastructure, IEEE 1588 PTP, smart contracts, DeFi, DAO governance, blockchain timing"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://roko.network/" />
        <meta property="og:title" content="ROKO Network - Temporal Blockchain Infrastructure" />
        <meta property="og:description" content="Novel blockchain infrastructure with hardware-grade timing measurement for next-generation Web3 applications." />
        <meta property="og:image" content="https://roko.network/images/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://roko.network/" />
        <meta property="twitter:title" content="ROKO Network - Temporal Blockchain Infrastructure" />
        <meta property="twitter:description" content="Novel blockchain infrastructure with hardware-grade timing measurement for next-generation Web3 applications." />
        <meta property="twitter:image" content="https://roko.network/images/twitter-image.png" />

        {/* Additional SEO */}
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <link rel="canonical" href="https://roko.network/" />

        {/* Performance hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ROKO Network",
            "description": "Temporal blockchain infrastructure with hardware timing measurement",
            "url": "https://roko.network",
            "logo": "https://roko.network/images/logo.png",
            "sameAs": [
              "https://twitter.com/rokonetwork",
              "https://github.com/roko-network",
              "https://discord.gg/rokonetwork"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Service",
              "email": "hello@roko.network"
            }
          })}
        </script>
      </Helmet>

      {/* Progress Bar */}
      <motion.div
        className={styles.progressBar}
        style={{ scaleX }}
      />

      {/* Floating Navigation */}
      <nav className={styles.floatingNav} role="navigation" aria-label="Page sections">
        <motion.div
          className={styles.navContainer}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {[
            { id: 'hero', label: 'Home' },
            { id: 'features', label: 'Features' },
            { id: 'technology', label: 'Technology' },
            { id: 'governance', label: 'Governance' },
            { id: 'ecosystem', label: 'Ecosystem' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleSmoothScroll(item.id)}
              className={styles.navItem}
              aria-label={`Navigate to ${item.label} section`}
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent} role="main">
        {/* Hero Section */}
        <section id="hero" data-section="hero" className={styles.section}>
          <Hero />
        </section>

        {/* Features Section */}
        <section id="features" data-section="features" className={styles.section}>
          <motion.div
            variants={parallaxVariants}
            initial="initial"
            animate="animate"
            className={styles.parallaxContainer}
          >
            <Features />
          </motion.div>
        </section>

        {/* Technology Section */}
        <section id="technology" data-section="technology" className={styles.section}>
          <Technology />
        </section>

        {/* Governance Section */}
        <section id="governance" data-section="governance" className={styles.section}>
          <motion.div
            variants={parallaxVariants}
            initial="initial"
            animate="animate"
            className={styles.parallaxContainer}
          >
            <Governance />
          </motion.div>
        </section>

        {/* Ecosystem Section */}
        <section id="ecosystem" data-section="ecosystem" className={styles.section}>
          <Ecosystem />
        </section>
      </main>

      {/* Background Effects */}
      <div className={styles.backgroundEffects}>
        {/* Animated Grid */}
        <div className={styles.animatedGrid} />

        {/* Floating Particles */}
        <div className={styles.floatingParticles}>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className={styles.particle}
              animate={{
                y: [-20, -100, -20],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'easeInOut',
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className={styles.gradientOrbs}>
          <motion.div
            className={`${styles.orb} ${styles.orb1}`}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className={`${styles.orb} ${styles.orb2}`}
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className={`${styles.orb} ${styles.orb3}`}
            animate={{
              x: [0, 50, 0],
              y: [0, -80, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>

      {/* Performance Monitor (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <PerformanceMonitor />
        </Suspense>
      )}

      {/* Skip Link for Accessibility */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      {/* Accessibility Announcements */}
      <div className="sr-only" aria-live="polite" id="page-announcements">
        ROKO Network homepage loaded with sections: Hero, Features, Technology, Governance, and Ecosystem
      </div>
    </div>
  );
};

export default HomePage;