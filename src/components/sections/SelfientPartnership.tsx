import { FC } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ShoppingBagIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CircleStackIcon,
  CubeIcon,
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
      aria-label="Project Nexus"
    >
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className={styles.title}>
            <span className={styles.gradientText}>Project Nexus</span>
            
          </h2>
          <p className={styles.subtitle}>
            Our MVP in development with Selfient
          </p>
        </motion.div>

        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.overview} variants={itemVariants}>
            <h3>Technical Vision</h3>
            <p>
              Create a decentralized serverless compute marketplace where blockchain handles settlement without slowing execution. Nexus combines Selfient's temporal escrow contracts on ROKO L1 with the MATRIC orchestration platform to enable trustless compute with automatic multi-party payments. Traditional workflows run at full speed while smart contracts guarantee payment distribution to validators, developers, and the ecosystem.
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
                <ShoppingBagIcon className={styles.featureIcon} />
                <h4>Marketplace</h4>
                <p>
                  Validators and providers compete to execute workloads with market-driven pricing.
                </p>
              </div>
              <div className={styles.featureItem}>
                <ClockIcon className={styles.featureIcon} />
                <h4>Temporal Guarantees</h4>
                <p>
                  ROKO's nanosecond timestamps enable high-frequency trading and time-sensitive operations.
                </p>
              </div>
              <div className={styles.featureItem}>
                <CurrencyDollarIcon className={styles.featureIcon} />
                <h4>Multi-Party Payments</h4>
                <p>
                  Automatic distribution to validators, developers (royalties), DAO, and platform operators.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.descriptions} variants={itemVariants}>
            <div className={styles.descriptionGrid}>
              <div className={styles.descriptionItem}>
                <CircleStackIcon className={styles.descriptionIcon} />
                <h4>Required</h4>
                <p>
                  Data gateway connects ANY existing database - enterprises keep their data where it is.
                </p>
              </div>
              <div className={styles.descriptionItem}>
                <CubeIcon className={styles.descriptionIcon} />
                <h4>MATRIC as Sole Interface</h4>
                <p>
                  All contract interaction through platform - no direct blockchain complexity for users.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SelfientPartnership;