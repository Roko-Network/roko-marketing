import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  CurrencyDollarIcon,
  PuzzlePieceIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import styles from '../shared/ContentPage.module.css';

interface EcosystemPageProps {
  section?: string;
}

const EcosystemPage: React.FC<EcosystemPageProps> = memo(({ section }) => {
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
      aria-label="ROKO Network ecosystem overview"
    >
      {/* Background Gradient */}
      <div className={`${styles.backgroundGradient} ${styles.ecosystem}`} />

      <div className={styles.container}>
        {/* Header Section */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 className={styles.title}>
            <span className={styles.gradientText}>Ecosystem</span>
          </h1>
          <p className={styles.subtitle}>
            Discover the growing ecosystem of partners, integrations, and applications
            built on ROKO Network's temporal infrastructure.
          </p>
        </motion.div>

        {/* Applications Grid */}
        <motion.div
          className={`${styles.cardGrid} ${styles.grid3}`}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.card} variants={itemVariants}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <CurrencyDollarIcon style={{ width: '1.5rem', height: '1.5rem', color: '#00d4aa' }} />
              <h3 className={styles.cardTitle}>DeFi Protocols</h3>
            </div>
            <p className={styles.cardDescription}>
              Temporal lending, MEV protection, and time-locked transactions
              leveraging nanosecond precision.
            </p>
            <div className={styles.itemList}>
              <div className={styles.listItem}>
                <div
                  className={styles.itemIcon}
                  style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                />
                <span className={styles.itemText}>TempoSwap</span>
              </div>
              <div className={styles.listItem}>
                <div
                  className={styles.itemIcon}
                  style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
                />
                <span className={styles.itemText}>ChronoLend</span>
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.card} variants={itemVariants}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <PuzzlePieceIcon style={{ width: '1.5rem', height: '1.5rem', color: '#00d4aa' }} />
              <h3 className={styles.cardTitle}>Gaming & NFTs</h3>
            </div>
            <p className={styles.cardDescription}>
              Time-based gaming mechanics and temporal NFT collections
              with real-time synchronization.
            </p>
            <div className={styles.itemList}>
              <div className={styles.listItem}>
                <div
                  className={styles.itemIcon}
                  style={{ backgroundColor: 'rgba(147, 51, 234, 0.2)' }}
                />
                <span className={styles.itemText}>TimeWars</span>
              </div>
              <div className={styles.listItem}>
                <div
                  className={styles.itemIcon}
                  style={{ backgroundColor: 'rgba(236, 72, 153, 0.2)' }}
                />
                <span className={styles.itemText}>Temporal Arts</span>
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.card} variants={itemVariants}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <WrenchScrewdriverIcon style={{ width: '1.5rem', height: '1.5rem', color: '#00d4aa' }} />
              <h3 className={styles.cardTitle}>Infrastructure</h3>
            </div>
            <p className={styles.cardDescription}>
              Oracles, indexers, and tools for temporal data
              with enterprise-grade reliability.
            </p>
            <div className={styles.itemList}>
              <div className={styles.listItem}>
                <div
                  className={styles.itemIcon}
                  style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)' }}
                />
                <span className={styles.itemText}>TimeOracle</span>
              </div>
              <div className={styles.listItem}>
                <div
                  className={styles.itemIcon}
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                />
                <span className={styles.itemText}>ChronoGraph</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Partners Section */}
        <motion.div
          className={styles.specialSection}
          variants={itemVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{ textAlign: 'center' }}
        >
          <h2 className={styles.sectionTitle}>Our Partners</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
            opacity: 0.7
          }}>
            {['Partner 1', 'Partner 2', 'Partner 3', 'Partner 4'].map((partner, index) => (
              <div
                key={partner}
                style={{
                  background: 'rgba(186, 192, 204, 0.1)',
                  height: '4rem',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(186, 192, 204, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                <BuildingOfficeIcon style={{ width: '1.5rem', height: '1.5rem', color: '#BCC1D1', marginRight: '0.5rem' }} />
                <span style={{ color: '#BCC1D1', fontWeight: 500 }}>{partner}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className={styles.specialSection}
          variants={itemVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h2 className={styles.sectionTitle}>Ecosystem Stats</h2>
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>25+</div>
              <div className={styles.statLabel}>Active dApps</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>$15M+</div>
              <div className={styles.statLabel}>Total Value Locked</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Active Users</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>1M+</div>
              <div className={styles.statLabel}>Transactions</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.gridOverlay} />
        <div className={`${styles.glowEffect} ${styles.ecosystem}`} />
      </div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite">
        {inView && 'Ecosystem section loaded with applications, partners, and ecosystem statistics'}
      </div>
    </section>
  );
});

export default EcosystemPage;