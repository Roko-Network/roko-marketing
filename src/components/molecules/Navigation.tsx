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
      label: 'Technology',
      href: '/technology',
      description: 'Temporal blockchain infrastructure'
    },
    {
      label: 'Governance',
      href: '/governance',
      description: 'Decentralized decision making'
    },
    {
      label: 'Developers',
      href: '/developers',
      description: 'Build on ROKO Network'
    },
    {
      label: 'Ecosystem',
      href: '/ecosystem',
      description: 'Partners and integrations'
    },
    {
      label: 'Documentation',
      href: 'https://docs.rokonetwork.com',
      description: 'Technical documentation',
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
        role="navigation"
        aria-label="Main navigation"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ul className={styles.mobileList}>
          {navigationItems.map((item) => {
            const isActive = !item.external && location.pathname === item.href;
            const isExternal = item.external || item.href.startsWith('http');

            return (
              <motion.li key={item.href} variants={itemVariants}>
                {isExternal ? (
                  <a
                    href={item.href}
                    className={clsx(styles.mobileLink, {
                      [styles.active]: isActive
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleClick(item.href, item.external)}
                    onKeyDown={(e) => handleKeyDown(e, item.href)}
                    onFocus={() => setFocusedItem(item.href)}
                    onBlur={() => setFocusedItem(null)}
                    aria-describedby={item.description ? `${item.href}-desc` : undefined}
                  >
                    <span className={styles.mobileLinkText}>{item.label}</span>
                    <span className={styles.externalIcon} aria-label="Opens in new tab">
                      ↗
                    </span>
                    {item.description && (
                      <span
                        id={`${item.href}-desc`}
                        className={styles.mobileLinkDescription}
                      >
                        {item.description}
                      </span>
                    )}
                  </a>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => clsx(styles.mobileLink, {
                      [styles.active]: isActive
                    })}
                    onClick={() => handleClick(item.href, item.external)}
                    onFocus={() => setFocusedItem(item.href)}
                    onBlur={() => setFocusedItem(null)}
                    aria-describedby={item.description ? `${item.href}-desc` : undefined}
                  >
                    <span className={styles.mobileLinkText}>{item.label}</span>
                    {item.description && (
                      <span
                        id={`${item.href}-desc`}
                        className={styles.mobileLinkDescription}
                      >
                        {item.description}
                      </span>
                    )}
                  </NavLink>
                )}
              </motion.li>
            );
          })}
        </ul>
      </motion.nav>
    );
  }

  return (
    <nav
      ref={navigationRef}
      className={clsx(styles.desktopNavigation, className)}
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className={styles.desktopList}>
        {navigationItems.map((item) => {
          const isActive = !item.external && location.pathname === item.href;
          const isExternal = item.external || item.href.startsWith('http');

          return (
            <li key={item.href} className={styles.desktopItem}>
              {isExternal ? (
                <a
                  href={item.href}
                  className={clsx(styles.desktopLink, {
                    [styles.active]: isActive,
                    [styles.focused]: focusedItem === item.href
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleClick(item.href, item.external)}
                  onKeyDown={(e) => handleKeyDown(e, item.href)}
                  onFocus={() => setFocusedItem(item.href)}
                  onBlur={() => setFocusedItem(null)}
                  aria-describedby={item.description ? `${item.href}-desc` : undefined}
                >
                  {item.label}
                  <span className={styles.externalIcon} aria-label="Opens in new tab">
                    ↗
                  </span>
                  {item.description && (
                    <span
                      id={`${item.href}-desc`}
                      className={styles.srOnly}
                    >
                      {item.description}
                    </span>
                  )}
                </a>
              ) : (
                <NavLink
                  to={item.href}
                  className={({ isActive }) => clsx(styles.desktopLink, {
                    [styles.active]: isActive,
                    [styles.focused]: focusedItem === item.href
                  })}
                  onClick={() => handleClick(item.href, item.external)}
                  onFocus={() => setFocusedItem(item.href)}
                  onBlur={() => setFocusedItem(null)}
                  aria-describedby={item.description ? `${item.href}-desc` : undefined}
                >
                  {item.label}
                  {item.description && (
                    <span
                      id={`${item.href}-desc`}
                      className={styles.srOnly}
                    >
                      {item.description}
                    </span>
                  )}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>

      {/* Active indicator for desktop */}
      <motion.div
        className={styles.activeIndicator}
        variants={indicatorVariants}
        initial="initial"
        animate="animate"
        style={{
          width: activeIndicator.width,
          left: activeIndicator.left,
        }}
      />
    </nav>
  );
});

Navigation.displayName = 'Navigation';