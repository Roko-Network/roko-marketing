import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ClockIcon,
  CpuChipIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import styles from '../shared/ContentPage.module.css';

interface TechnologyPageProps {
  section?: string;
}

const TechnologyPage: React.FC<TechnologyPageProps> = memo(({ section }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <section
      ref={ref}
      className={styles.contentPage}
      role="region"
      aria-label="ROKO Network technology overview"
    >
      {/* Background Gradient */}
      <div className={`${styles.backgroundGradient} ${styles.technology}`} />

      <div className={styles.container}>
        {/* Header Section */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 className={styles.title}>
            <span className={styles.gradientText}>Technology</span>
          </h1>
          <p className={styles.subtitle}>
            ROKO Network introduces temporal synchronization to blockchain technology,
            enabling unprecedented precision in time-sensitive applications.
          </p>
        </motion.div>

        {section === 'temporal-layer' && (
          <motion.div
            className={styles.specialSection}
            variants={itemVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <h2 className={styles.sectionTitle}>Temporal Layer</h2>
            <p className={styles.cardDescription}>
              Our temporal layer provides nanosecond-precision timestamps using IEEE 1588 PTP protocol,
              enabling unprecedented synchronization accuracy across global validator networks.
            </p>
          </motion.div>
        )}

        {section === 'consensus' && (
          <motion.div
            className={styles.specialSection}
            variants={itemVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <h2 className={styles.sectionTitle}>Consensus Mechanism</h2>
            <p className={styles.cardDescription}>
              Temporal Proof of Stake (TPoS) ensures both security and temporal accuracy,
              creating a revolutionary consensus mechanism built for time-sensitive applications.
            </p>
          </motion.div>
        )}

        {!section && (
          <motion.div
            className={`${styles.cardGrid} ${styles.grid3}`}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <motion.div className={styles.card} variants={itemVariants}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <ClockIcon style={{ width: '1.5rem', height: '1.5rem', color: '#00d4aa' }} />
                <h3 className={styles.cardTitle}>Temporal Layer</h3>
              </div>
              <p className={styles.cardDescription}>
                IEEE 1588 PTP-grade synchronization for nanosecond precision
                across global validator networks.
              </p>
              <Link to="/technology/temporal-layer" className={styles.cardLink}>
                Learn more
              </Link>
            </motion.div>

            <motion.div className={styles.card} variants={itemVariants}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <ShieldCheckIcon style={{ width: '1.5rem', height: '1.5rem', color: '#00d4aa' }} />
                <h3 className={styles.cardTitle}>Consensus</h3>
              </div>
              <p className={styles.cardDescription}>
                Temporal Proof of Stake for secure and time-aware validation
                with enhanced security guarantees.
              </p>
              <Link to="/technology/consensus" className={styles.cardLink}>
                Learn more
              </Link>
            </motion.div>

            <motion.div className={styles.card} variants={itemVariants}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <CpuChipIcon style={{ width: '1.5rem', height: '1.5rem', color: '#00d4aa' }} />
                <h3 className={styles.cardTitle}>Architecture</h3>
              </div>
              <p className={styles.cardDescription}>
                Scalable infrastructure designed for time-sensitive applications
                with enterprise-grade performance.
              </p>
              <Link to="/technology/architecture" className={styles.cardLink}>
                Learn more
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.gridOverlay} />
        <div className={`${styles.glowEffect} ${styles.technology}`} />
      </div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite">
        {/* Screen reader announcement removed */}
      </div>
    </section>
  );
});

export default TechnologyPage;