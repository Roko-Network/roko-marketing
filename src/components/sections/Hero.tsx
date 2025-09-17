import { FC, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useInView } from 'react-intersection-observer';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { TemporalOrb } from '../3d/TemporalOrb';
import { AccessibilityFallback } from '../3d/AccessibilityFallback';
import { TokenStats } from '../TokenStats';
import styles from './Hero.module.css';

interface HeroProps {
  // Props for Hero component
}


export const Hero: FC<HeroProps> = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [orbHovered] = useState(false);


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
          Time measuring precision blockchain infrastructure powered by{' '}
          <span className={styles.highlight}>IEEE 1588 PTP</span> hardware synchronization.
          <br />
          Build the next generation of time-critical Web3 applications.
        </motion.p>


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

        {/* Dynamic Token Stats */}
        <motion.div className={styles.tokenStatsContainer} variants={itemVariants}>
          <TokenStats
            variant="hero"
            showHeader={false}
            className={styles.heroTokenStats}
          />
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