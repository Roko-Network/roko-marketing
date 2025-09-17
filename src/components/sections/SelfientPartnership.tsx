import { FC } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  CodeBracketIcon,
  ShieldCheckIcon,
  CubeTransparentIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import styles from './SelfientPartnership.module.css';

export const SelfientPartnership: FC = () => {
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
      className={styles.selfientPartnership}
      role="region"
      aria-label="Roko-Selfient Partnership"
    >
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className={styles.title}>
            <span className={styles.gradientText}>Roko-Selfient</span>
            <br />
            Partnership
          </h2>
          <p className={styles.subtitle}>
            Revolutionary no-code smart contract development through strategic partnership
          </p>
        </motion.div>

        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.overview} variants={itemVariants}>
            <h3>Partnership Overview</h3>
            <p>
              ROKO Network has partnered with Selfient to bring no-code audited smart contract
              creation to our temporal blockchain infrastructure. This collaboration enables
              developers and enterprises to deploy secure, pre-audited smart contracts without
              writing a single line of code.
            </p>
            <a
              href="https://nexus.selfient.xyz/#/technical-contracts"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.proposalLink}
            >
              View Technical Proposal
              <ArrowTopRightOnSquareIcon className={styles.linkIcon} />
            </a>
          </motion.div>

          <motion.div className={styles.features} variants={itemVariants}>
            <h3>Key Features</h3>
            <div className={styles.featureGrid}>
              <div className={styles.featureItem}>
                <CodeBracketIcon className={styles.featureIcon} />
                <h4>No-Code Development</h4>
                <p>
                  Create complex smart contracts through intuitive visual interfaces
                  without programming expertise
                </p>
              </div>
              <div className={styles.featureItem}>
                <ShieldCheckIcon className={styles.featureIcon} />
                <h4>Pre-Audited Templates</h4>
                <p>
                  Deploy from a library of professionally audited smart contract
                  templates ensuring security
                </p>
              </div>
              <div className={styles.featureItem}>
                <CubeTransparentIcon className={styles.featureIcon} />
                <h4>Temporal Integration</h4>
                <p>
                  Seamlessly integrated with ROKO's temporal consensus for
                  nanosecond-precision contract execution
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.benefits} variants={itemVariants}>
            <h3>Benefits</h3>
            <ul className={styles.benefitsList}>
              <li>Dramatically reduced development time and costs</li>
              <li>Enterprise-grade security without audit overhead</li>
              <li>Accessibility for non-technical stakeholders</li>
              <li>Seamless integration with ROKO's temporal infrastructure</li>
              <li>Built-in compliance and regulatory features</li>
            </ul>
          </motion.div>

          <motion.div className={styles.status} variants={itemVariants}>
            <div className={styles.statusBadge}>In Development</div>
            <p className={styles.statusText}>
              This partnership is currently in active development. Stay tuned for updates
              on availability and early access programs.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SelfientPartnership;