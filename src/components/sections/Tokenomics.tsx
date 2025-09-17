import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import TokenStats from '../TokenStats/TokenStats';
import styles from './Tokenomics.module.css';

const Tokenomics: React.FC = memo(() => {
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
        staggerChildren: 0.2,
        delayChildren: 0.1
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
      className={styles.tokenomics}
      role="region"
      aria-label="ROKO tokenomics overview"
    >
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          variants={itemVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h2 className={styles.title}>
            <span className={styles.gradientText}>Tokenomics</span>
            <br />
            at a glance
          </h2>
          <p className={styles.subtitle}>
            Real-time statistics and key metrics for the ROKO token ecosystem.
          </p>
        </motion.div>

        <motion.div
          className={styles.statsContainer}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants}>
            <TokenStats
              showHeader={false}
              variant="hero"
              className={styles.tokenStatsComponent}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

Tokenomics.displayName = 'Tokenomics';

export default Tokenomics;