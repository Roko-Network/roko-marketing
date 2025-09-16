import { FC, memo, useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './Navigation.module.css';

interface NavigationItem {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface NavigationProps {
  isMobile?: boolean;
  className?: string;
  onNavigate?: () => void;
  currentPage?: string;
  onScroll?: (event: Event) => void;
}

/**
 * Navigation Component
 *
 * Responsive navigation menu with active state indicators, smooth scroll,
 * and full accessibility support. Supports both desktop and mobile layouts.
 */
export const Navigation: FC<NavigationProps> = memo(({
  isMobile = false,
  className,
  onNavigate,
  currentPage,
  onScroll
}) => {
  const location = useLocation();
  const [activeIndicator, setActiveIndicator] = useState({ width: 0, left: 0 });
  const navigationRef = useRef<HTMLElement>(null);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);

  // Navigation items configuration
  const navigationItems: NavigationItem[] = [
    {
      label: 'Documentation',
      href: 'https://docs.roko.network/',
      description: 'Technical documentation and guides',
      external: true
    },
    {
      label: 'DAO Governance',
      href: 'https://snapshot.org/#/rokonetwork.eth',
      description: 'Participate in ROKO Network governance',
      external: true
    },
    {
      label: 'Get ROKO',
      href: 'https://app.uniswap.org/explore/tokens/ethereum/0x6f222e04f6c53cc688ffb0abe7206aac66a8ff98',
      description: 'Buy ROKO tokens on Uniswap',
      external: true
    }
  ];

  // Update active indicator position (desktop only)
  useEffect(() => {
    if (isMobile || !navigationRef.current) return;

    const updateIndicator = () => {
      const activeLink = navigationRef.current?.querySelector(`.${styles.active}`) as HTMLElement;
      if (activeLink) {
        const rect = activeLink.getBoundingClientRect();
        const navRect = navigationRef.current!.getBoundingClientRect();
        setActiveIndicator({
          width: rect.width,
          left: rect.left - navRect.left
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [location.pathname, isMobile]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, href: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (href.startsWith('http')) {
        window.open(href, '_blank', 'noopener noreferrer');
      }
      onNavigate?.();
    }
  };

  // Handle smooth scroll for hash links
  const handleClick = (href: string, external?: boolean) => {
    if (external) {
      return; // Let the browser handle external links
    }

    // Handle hash links for smooth scrolling
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      if (path === location.pathname || path === '') {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    }

    onNavigate?.();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  const indicatorVariants = {
    initial: { scaleX: 0 },
    animate: {
      scaleX: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  if (isMobile) {
    return (
      <motion.nav
        ref={navigationRef}
        className={clsx(styles.mobileNavigation, className)}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <ul className={styles.mobileList}>
          {navigationItems.map((item) => (
            <motion.li key={item.href} variants={itemVariants}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileLink}
                  onClick={() => handleClick(item.href, item.external)}
                  onKeyDown={(e) => handleKeyDown(e, item.href)}
                  onFocus={() => setFocusedItem(item.href)}
                  onBlur={() => setFocusedItem(null)}
                  aria-describedby={item.description ? `${item.href.replace(/[^a-zA-Z0-9]/g, '')}-desc` : undefined}
                >
                  <div className={styles.mobileLinkText}>
                    {item.label}
                    <span className={styles.externalIcon} aria-label="Opens in new tab">
                      ↗
                    </span>
                  </div>
                  {item.description && (
                    <div className={styles.mobileLinkDescription}>
                      {item.description}
                    </div>
                  )}
                  {item.description && (
                    <span
                      id={`${item.href.replace(/[^a-zA-Z0-9]/g, '')}-desc`}
                      className={styles.srOnly}
                    >
                      {item.description}
                    </span>
                  )}
                </a>
              ) : (
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    clsx(styles.mobileLink, {
                      [styles.active]: isActive,
                      [styles.focused]: focusedItem === item.href
                    })
                  }
                  onClick={() => handleClick(item.href, item.external)}
                  onKeyDown={(e) => handleKeyDown(e, item.href)}
                  onFocus={() => setFocusedItem(item.href)}
                  onBlur={() => setFocusedItem(null)}
                  aria-describedby={item.description ? `${item.href.replace(/[^a-zA-Z0-9]/g, '')}-desc` : undefined}
                >
                  {item.label}
                  {item.description && (
                    <span
                      id={`${item.href.replace(/[^a-zA-Z0-9]/g, '')}-desc`}
                      className={styles.srOnly}
                    >
                      {item.description}
                    </span>
                  )}
                </NavLink>
              )}
            </motion.li>
          ))}
        </ul>
      </motion.nav>
    );
  }

  // Desktop navigation
  return (
    <motion.nav
      ref={navigationRef}
      className={clsx(styles.desktopNavigation, className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className={styles.desktopList}>
        {navigationItems.map((item) => (
          <motion.li key={item.href} variants={itemVariants}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.desktopLink}
                onClick={() => handleClick(item.href, item.external)}
                onKeyDown={(e) => handleKeyDown(e, item.href)}
                onFocus={() => setFocusedItem(item.href)}
                onBlur={() => setFocusedItem(null)}
                aria-describedby={item.description ? `${item.href.replace(/[^a-zA-Z0-9]/g, '')}-desc` : undefined}
              >
                {item.label}
                <span className={styles.externalIcon} aria-label="Opens in new tab">
                  ↗
                </span>
                {item.description && (
                  <span
                    id={`${item.href.replace(/[^a-zA-Z0-9]/g, '')}-desc`}
                    className={styles.srOnly}
                  >
                    {item.description}
                  </span>
                )}
              </a>
            ) : (
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  clsx(styles.desktopLink, {
                    [styles.active]: isActive,
                    [styles.focused]: focusedItem === item.href
                  })
                }
                onClick={() => handleClick(item.href, item.external)}
                onKeyDown={(e) => handleKeyDown(e, item.href)}
                onFocus={() => setFocusedItem(item.href)}
                onBlur={() => setFocusedItem(null)}
                aria-describedby={item.description ? `${item.href.replace(/[^a-zA-Z0-9]/g, '')}-desc` : undefined}
              >
                {item.label}
                {item.description && (
                  <span
                    id={`${item.href.replace(/[^a-zA-Z0-9]/g, '')}-desc`}
                    className={styles.srOnly}
                  >
                    {item.description}
                  </span>
                )}
              </NavLink>
            )}
          </motion.li>
        ))}
      </ul>

      {/* Active indicator for desktop */}
      {activeIndicator.width > 0 && (
        <motion.div
          className={styles.activeIndicator}
          style={{
            width: activeIndicator.width,
            left: activeIndicator.left
          }}
          variants={indicatorVariants}
          initial="initial"
          animate="animate"
          layout
        />
      )}
    </motion.nav>
  );
});

Navigation.displayName = 'Navigation';