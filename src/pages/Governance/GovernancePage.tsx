import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  CheckBadgeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import styles from '../shared/ContentPage.module.css';

interface GovernancePageProps {
  section?: string;
}

const GovernancePage: React.FC<GovernancePageProps> = memo(({ section }) => {
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
      aria-label="ROKO Network governance system"
    >
      {/* Background Gradient */}
      <div className={`${styles.backgroundGradient} ${styles.governance}`} />

      <div className={styles.container}>
        {/* Header Section */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 className={styles.title}>
            <span className={styles.gradientText}>Governance</span>
          </h1>
          <p className={styles.subtitle}>
            Participate in the decentralized governance of ROKO Network through
            proposal voting and validator staking.
          </p>
        </motion.div>

        {/* Governance Grid */}
        <motion.div
          className={`${styles.cardGrid} ${styles.grid2}`}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.card} variants={itemVariants}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <CheckBadgeIcon style={{ width: '1.5rem', height: '1.5rem', color: '#00d4aa' }} />
              <h3 className={styles.cardTitle}>Active Proposals</h3>
            </div>
            <p className={styles.cardDescription}>
              Vote on network upgrades, parameter changes, and community initiatives
              that shape the future of ROKO Network.
            </p>
            <div className={styles.itemList}>
              <div className={styles.listItem}>
                <div
                  className={styles.itemIcon}
                  style={{ backgroundColor: 'rgba(0, 212, 170, 0.2)' }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>
                    Proposal #001
                  </div>
                  <div className={styles.itemText}>Network parameter adjustment</div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.5rem',
                    fontSize: '0.8rem'
                  }}>
                    <span style={{ color: '#00ff00' }}>Status: Active</span>
                    <span style={{ color: '#ff6600ff' }}>Ends in 5 days</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.card} variants={itemVariants}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <UserGroupIcon style={{ width: '1.5rem', height: '1.5rem', color: '#00d4aa' }} />
              <h3 className={styles.cardTitle}>Validator Network</h3>
            </div>
            <p className={styles.cardDescription}>
              Secure the network by staking ROKO tokens with trusted validators
              and participate in consensus.
            </p>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>12.5M</div>
                <div className={styles.statLabel}>Total Staked</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>127</div>
                <div className={styles.statLabel}>Active Validators</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>65.8%</div>
                <div className={styles.statLabel}>Staking Ratio</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>8.2%</div>
                <div className={styles.statLabel}>APY</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.gridOverlay} />
        <div className={`${styles.glowEffect} ${styles.governance}`} />
      </div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite">
        {/* Screen reader announcement removed */}
      </div>
    </section>
  );
});

export default GovernancePage;