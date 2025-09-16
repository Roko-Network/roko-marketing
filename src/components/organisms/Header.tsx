import { FC, memo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Navigation } from '../molecules/Navigation';
import { tokens } from '../../styles/tokens';
import styles from './Header.module.css';

export interface HeaderProps {
  className?: string;
}

/**
 * Header Component
 *
 * Fixed position header with glassmorphism effect and ROKO branding.
 * Features responsive navigation, active state indicators, and accessibility compliance.
 */
export const Header: FC<HeaderProps> = memo(({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const headerVariants = {
    initial: {
      backgroundColor: 'rgba(24, 24, 24, 0.8)',
      backdropFilter: 'blur(8px)',
    },
    scrolled: {
      backgroundColor: 'rgba(24, 24, 24, 0.95)',
      backdropFilter: 'blur(12px)',
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      {/* Skip navigation link for accessibility */}
      <a
        href="#main-content"
        className={styles.skipLink}
        onFocus={(e) => {
          e.currentTarget.style.top = '0';
        }}
        onBlur={(e) => {
          e.currentTarget.style.top = '-40px';
        }}
      >
        Skip to main content
      </a>

      <motion.header
        className={clsx(styles.header, className)}
        variants={headerVariants}
        initial="initial"
        animate={isScrolled ? 'scrolled' : 'initial'}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        role="banner"
      >
        <div className={styles.container}>
          {/* Logo */}
          <Link
            to="/"
            className={styles.logo}
            aria-label="ROKO Network - Home"
          >
            <motion.div
              className={styles.logoText}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              ROKO
            </motion.div>
            <span className={styles.logoSubtext}>Network</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            <Navigation />
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={styles.hamburger}>
              <span className={clsx(styles.hamburgerLine, {
                [styles.hamburgerLineActive]: isMobileMenuOpen
              })} />
              <span className={clsx(styles.hamburgerLine, {
                [styles.hamburgerLineActive]: isMobileMenuOpen
              })} />
              <span className={clsx(styles.hamburgerLine, {
                [styles.hamburgerLineActive]: isMobileMenuOpen
              })} />
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              className={styles.mobileMenu}
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <motion.div className={styles.mobileNavigation} variants={menuItemVariants}>
                <Navigation isMobile />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
});

Header.displayName = 'Header';