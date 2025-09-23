import { FC } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ClockIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UsersIcon,
  CodeBracketIcon,
  CubeTransparentIcon
} from '@heroicons/react/24/outline';
import styles from './Features.module.css';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  metric?: string;
  detail: string;
}

const features: Feature[] = [
  {
    id: 'nanosecond-precision',
    title: 'Time measuring precision',
    description: 'IEEE 1588 PTP-grade hardware timing infrastructure for critical blockchain operations.',
    icon: ClockIcon,
    metric: '~1ns',
    detail: 'Precision Time Protocol synchronization across global validator network'
  },
  {
    id: 'global-sync',
    title: 'Global Synchronization',
    description: 'Validators maintain temporal consensus.',
    icon: GlobeAltIcon,
    metric: '24/7',
    detail: 'Continuous operation with redundant timing infrastructure'
  },
  {
    id: 'validator-network',
    title: 'Validator Network',
    description: 'Decentralized network of temporal validators ensuring consensus.',
    icon: ShieldCheckIcon,
    metric: '99.9%',
    detail: 'Enterprise-grade uptime with byzantine fault tolerance'
  },
  {
    id: 'dao-governance',
    title: 'DAO Governance',
    description: 'Community-driven governance with pwROKO voting power.',
    icon: UsersIcon,
    metric: 'pwROKO',
    detail: 'Stake tokens for voting rights and network participation'
  },
  {
    id: 'developer-tools',
    title: 'Developer Tools',
    description: 'Comprehensive SDK and APIs for temporal blockchain development.',
    icon: CodeBracketIcon,
    metric: 'SDK',
    detail: 'TypeScript, Rust, and Go libraries with extensive documentation'
  },
  {
    id: 'white-label',
    title: 'White-Label Solutions',
    description: 'Enterprise-ready infrastructure for custom temporal applications.',
    icon: CubeTransparentIcon,
    metric: 'Custom',
    detail: 'Tailored solutions for financial services and IoT applications'
  }
];

export const Features: FC = () => {
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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      filter: 'blur(10px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.2
      }
    }
  };

  const glowVariants = {
    hover: {
      boxShadow: [
        '0 0 20px rgba(0, 120, 212, 0.1)',
        '0 0 40px rgba(0, 120, 212, 0.2)',
        '0 0 20px rgba(0, 120, 212, 0.1)'
      ],
      borderColor: '#000000',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <section
      ref={ref}
      className={styles.features}
      role="region"
      aria-label="ROKO Network key features"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className={styles.title}>
            <span className={styles.gradientText}>Temporal Precision at Scale</span>
          </h2>
          <p className={styles.subtitle}>
            Revolutionary blockchain infrastructure combining nanosecond timing accuracy
            with enterprise-grade reliability for the next generation of Web3 applications.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {features.map((feature, index) => (
            <motion.article
              key={feature.id}
              className={styles.card}
              variants={cardVariants}
              whileHover="hover"
              custom={index}
            >
              <motion.div
                className={styles.cardContent}
                variants={glowVariants}
              >
                {/* Icon Container */}
                <motion.div
                  className={styles.iconContainer}
                  variants={iconVariants}
                >
                  <feature.icon className={styles.icon} />
                  {feature.metric && (
                    <span className={styles.metric}>{feature.metric}</span>
                  )}
                </motion.div>

                {/* Content */}
                <div className={styles.textContent}>
                  <h3 className={styles.cardTitle}>{feature.title}</h3>
                  <p className={styles.cardDescription}>{feature.description}</p>
                  <p className={styles.cardDetail}>{feature.detail}</p>
                </div>

                {/* Hover Effect Overlay */}
                <div className={styles.hoverOverlay} />

                {/* Background Pattern */}
                <div className={styles.backgroundPattern} />
              </motion.div>
            </motion.article>
          ))}
        </motion.div>

      </div>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.gridPattern} />
        <div className={styles.glowSphere} />
      </div>

      {/* Accessibility - Screen reader only */}
      <div className="sr-only" aria-live="polite">
        {/* Removed visible text announcement */}
      </div>
    </section>
  );
};

export default Features;