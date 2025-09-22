import React, { useEffect, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { NetworkStats } from './NetworkStats';
import { TimelineVisualization } from './TimelineVisualization';
import { CTAButtons } from './CTAButtons';
import { useNetworkStats } from '@/hooks/useNetworkStats';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  navigate?: (path: string) => void;
  onRender?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = memo(({ navigate, onRender }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const { stats, loading, error } = useNetworkStats();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    onRender?.();
  }, [onRender]);

  const handleCTAClick = useCallback((path: string) => {
    navigate?.(path);
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.8,
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.5 },
    },
  };

  return (
    <section
      ref={ref}
      className={styles.hero}
      role="region"
      aria-label="Hero section"
    >
      <div className={styles.backgroundWrapper}>
        <img
          src="/hero-background.webp"
          alt=""
          loading="lazy"
          className={styles.backgroundImage}
          data-testid="hero-background"
        />
      </div>

      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.h1
          className={styles.headline}
          variants={itemVariants}
        >
          Decentralized Time
        </motion.h1>

        <motion.p
          className={styles.subheadline}
          variants={itemVariants}
        >
          Build time-sensitive blockchain applications with hardware-grade timing infrastructure.
          IEEE 1588 PTP-grade synchronization for the next generation of Web3.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className={styles.visualizationContainer}
        >
          <TimelineVisualization
            animated={!prefersReducedMotion}
            data-testid="timeline-visualization"
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={styles.statsContainer}
          aria-label="Network statistics"
        >
          <NetworkStats
            stats={stats}
            loading={loading}
            error={error}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={styles.ctaContainer}
        >
          <CTAButtons onNavigate={handleCTAClick} />
        </motion.div>
      </motion.div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';