import { FC, Suspense, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useInView } from 'react-intersection-observer';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { TemporalOrb } from '../3d/TemporalOrb';
import { AccessibilityFallback } from '../3d/AccessibilityFallback';
import styles from './Hero.module.css';

interface HeroProps {
  onStartBuilding?: () => void;
  onReadDocs?: () => void;
}

export const Hero: FC<HeroProps> = ({ onStartBuilding, onReadDocs }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [orbHovered, setOrbHovered] = useState(false);

  const handleStartBuilding = useCallback(() => {
    onStartBuilding?.();
  }, [onStartBuilding]);

  const handleReadDocs = useCallback(() => {
    onReadDocs?.();
  }, [onReadDocs]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(0, 120, 212, 0.2)',
        '0 0 40px rgba(0, 120, 212, 0.4)',
        '0 0 20px rgba(0, 120, 212, 0.2)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const typewriterVariants = {
    hidden: { width: 0 },
    visible: {
      width: '100%',
      transition: {
        duration: 2,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <section
      ref={ref}
      className={styles.hero}
      role="region"
      aria-label="Hero section introducing ROKO Network"
    >
      {/* Background Gradient */}
      <div className={styles.backgroundGradient} />

      {/* 3D Scene Container */}
      <div className={styles.sceneContainer}>
        <Suspense fallback={<AccessibilityFallback />}>
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            className={styles.canvas}
            aria-hidden="true"
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <TemporalOrb
              position={[2, 0, 0]}
              scale={1.2}
              isHovered={orbHovered}
              performanceLevel="high"
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Content Container */}
      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Main Headline */}
        <motion.div className={styles.headlineContainer} variants={itemVariants}>
          <h1 className={styles.headline}>
            <span className={styles.gradientText}>The Temporal Layer</span>
            <br />
            <motion.span
              className={styles.typewriter}
              variants={typewriterVariants}
            >
              for Web3
            </motion.span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p className={styles.subheadline} variants={itemVariants}>
          Nanosecond precision blockchain infrastructure powered by{' '}
          <span className={styles.highlight}>IEEE 1588 PTP</span> synchronization.
          <br />
          Build the next generation of time-critical Web3 applications.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className={styles.ctaContainer} variants={itemVariants}>
          <motion.button
            className={styles.primaryCta}
            onClick={handleStartBuilding}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            variants={glowVariants}
            animate="animate"
            onHoverStart={() => setOrbHovered(true)}
            onHoverEnd={() => setOrbHovered(false)}
          >
            <span>Start Building</span>
            <span className={styles.ctaIcon}>→</span>
          </motion.button>

          <motion.button
            className={styles.secondaryCta}
            onClick={handleReadDocs}
            whileHover={{ scale: 1.02, borderColor: '#0078D4' }}
            whileTap={{ scale: 0.98 }}
          >
            Read Documentation
          </motion.button>
        </motion.div>

        {/* Network Stats */}
        <motion.div className={styles.statsContainer} variants={itemVariants}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>~1ns</span>
            <span className={styles.statLabel}>Precision</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>24/7</span>
            <span className={styles.statLabel}>Uptime</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>Global</span>
            <span className={styles.statLabel}>Network</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className={styles.scrollIndicator}
        variants={itemVariants}
        animate={{
          y: [0, 10, 0],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <ChevronDownIcon className={styles.scrollIcon} />
        <span className={styles.scrollText}>Explore Features</span>
      </motion.div>

      {/* Accessibility - Screen reader only */}
      <div className="sr-only" aria-live="polite">
        {/* Screen reader announcement removed */}
      </div>
    </section>
  );
};

export default Hero;