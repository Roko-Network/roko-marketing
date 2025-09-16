import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  DocumentTextIcon,
  CodeBracketIcon,
  BeakerIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import styles from './DevelopersPage.module.css';

interface DevelopersPageProps {
  section?: string;
}

const DevelopersPage: React.FC<DevelopersPageProps> = memo(({ section }) => {
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
      className={styles.developers}
      role="region"
      aria-label="Developer resources and documentation"
    >
      {/* Background Gradient */}
      <div className={styles.backgroundGradient} />

      <div className={styles.container}>
        {/* Header Section */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 className={styles.title}>
            <span className={styles.gradientText}>Developer Hub</span>
          </h1>
          <p className={styles.subtitle}>
            Build the next generation of time-sensitive dApps on ROKO Network
            with our comprehensive developer tools and resources.
          </p>
        </motion.div>

        {/* Resource Grid */}
        <motion.div
          className={styles.resourceGrid}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.resourceCard} variants={itemVariants}>
            <div className={styles.iconContainer}>
              <DocumentTextIcon className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Documentation</h3>
            <p className={styles.cardDescription}>
              Comprehensive guides, API references, and tutorials to get you started.
            </p>
            <Link to="/developers/docs" className={styles.cardLink}>
              Read the docs
            </Link>
          </motion.div>

          <motion.div className={styles.resourceCard} variants={itemVariants}>
            <div className={styles.iconContainer}>
              <CodeBracketIcon className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>SDKs</h3>
            <p className={styles.cardDescription}>
              Native SDKs for JavaScript, Python, Go, and Rust with temporal support.
            </p>
            <Link to="/developers/sdks" className={styles.cardLink}>
              Get SDKs
            </Link>
          </motion.div>

          <motion.div className={styles.resourceCard} variants={itemVariants}>
            <div className={styles.iconContainer}>
              <BeakerIcon className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>API Reference</h3>
            <p className={styles.cardDescription}>
              Complete REST and WebSocket API documentation with temporal endpoints.
            </p>
            <Link to="/developers/api" className={styles.cardLink}>
              View API
            </Link>
          </motion.div>

          <motion.div className={styles.resourceCard} variants={itemVariants}>
            <div className={styles.iconContainer}>
              <BookOpenIcon className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Tutorials</h3>
            <p className={styles.cardDescription}>
              Step-by-step guides to build temporal dApps from scratch.
            </p>
            <Link to="/developers/tutorials" className={styles.cardLink}>
              Start learning
            </Link>
          </motion.div>

          <motion.div className={styles.resourceCard} variants={itemVariants}>
            <div className={styles.iconContainer}>
              <UserGroupIcon className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Community</h3>
            <p className={styles.cardDescription}>
              Join our developer community for support, discussions, and updates.
            </p>
            <a href="https://discord.gg/roko" className={styles.cardLink}>
              Join Discord
            </a>
          </motion.div>

          <motion.div className={styles.resourceCard} variants={itemVariants}>
            <div className={styles.iconContainer}>
              <ChartBarIcon className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Examples</h3>
            <p className={styles.cardDescription}>
              Working examples and sample applications using temporal features.
            </p>
            <a href="https://github.com/roko-network/examples" className={styles.cardLink}>
              View examples
            </a>
          </motion.div>
        </motion.div>

        {/* Quick Start Section */}
        <motion.div
          className={styles.quickStart}
          variants={itemVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h2 className={styles.quickStartTitle}>Quick Start</h2>
          <div className={styles.codeContainer}>
            <div className={styles.codeBlock}>
              <pre>
{`# Install the ROKO SDK
npm install @roko/sdk

# Initialize your project
import { RokoClient } from '@roko/sdk';

const client = new RokoClient({
  network: 'mainnet',
  apiKey: 'your-api-key'
});

// Get current network time with nanosecond precision
const timestamp = await client.temporal.now();
console.log('Current time:', timestamp);`}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.gridOverlay} />
        <div className={styles.glowEffect} />
      </div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite">
        {/* Screen reader announcement removed */}
      </div>
    </section>
  );
});

export default DevelopersPage;