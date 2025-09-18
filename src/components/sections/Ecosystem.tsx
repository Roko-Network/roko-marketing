import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  BuildingOfficeIcon,
  CubeIcon,
  ClockIcon,
  BanknotesIcon,
  GlobeAltIcon,
  UserGroupIcon,
  StarIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import styles from './Ecosystem.module.css';

interface Partner {
  id: string;
  name: string;
  category: 'partners' | 'service-providers' | 'built-on';
  description: string;
  logo: string;
  website?: string;
  featured?: boolean;
}

interface Solution {
  id: string;
  name: string;
  description: string;
  category: 'dapps' | 'infrastructure-tooling';
  type?: string;
  image: string;
  status: 'live' | 'beta' | 'coming-soon' | 'development';
  website?: string;
}

// Testimonial interface removed - Issue #7

interface Integration {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'live' | 'beta' | 'coming-soon';
}

const partners: Partner[] = [
  // Partners
  {
    id: 'fractional-robots',
    name: 'Fractional Robots',
    category: 'partners',
    description: 'Specialized solutions for distributed systems and agent coordination',
    logo: '/logos/fractional-robots.svg',
    website: 'https://fractionalrobots.com',
    featured: true
  },
  {
    id: 'exa-group',
    name: 'Exa Group',
    category: 'partners',
    description: 'Token engineering and DAO strategy specialists improving capital efficiency',
    logo: '/logos/exa-group.svg',
    website: 'https://www.exagroup.xyz',
    featured: true
  },
  {
    id: 'selfient',
    name: 'Selfient',
    category: 'partners',
    description: 'EVM blockchain technology company providing no-code smart contract creation tools',
    logo: '/logos/selfient.svg',
    website: 'https://www.selfient.xyz',
    featured: true
  },
  {
    id: 'unforkable',
    name: 'Unforkable',
    category: 'partners',
    description: 'DeFi engineering specialists building secure smart contracts and full-stack solutions',
    logo: '/logos/unforkable.svg',
    website: 'https://unforkable.co',
    featured: false
  },
  {
    id: 'trustid',
    name: 'TrustID',
    category: 'partners',
    description: 'Identity verification platform providing portable, privacy-safe digital identity',
    logo: '/logos/trustid.svg',
    website: 'https://www.trustid.life/business',
    featured: false
  },
  // Service Providers
  {
    id: 'time-beat',
    name: 'Time Beat',
    category: 'service-providers',
    description: 'IEEE-1588 PTP & NTP precision time synchronization solutions for critical systems',
    logo: '/logos/time-beat.svg',
    website: 'https://www.timebeat.app',
    featured: true
  },
  {
    id: 'iskout',
    name: 'Iskout',
    category: 'service-providers',
    description: 'Rapid precision hiring and talent acquisition specialists for tech companies',
    logo: '/logos/iskout.svg',
    website: 'https://www.iskout.com',
    featured: false
  },
  // Built on
  {
    id: 'ocp-tap',
    name: 'OCP TAP',
    category: 'built-on',
    description: 'Open Compute Project Time Appliances providing IEEE 1588 PTP timing infrastructure',
    logo: '/logos/ocp-tap.svg',
    website: 'https://www.opencompute.org/projects/time-appliances-project-tap',
    featured: true
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    category: 'built-on',
    description: 'Multichain platform enabling blockchain interoperability and scalable applications',
    logo: '/logos/polkadot.svg',
    website: 'https://polkadot.com/platform/sdk',
    featured: true
  }
];

const featuredSolutions: Solution[] = [
  // dApps
  {
    id: 'matric-studio',
    name: 'Matric Studio',
    description: 'Application framework for developing orchestration pipelines to coordinate systems and agentic models',
    category: 'dapps',
    type: 'Application Framework',
    image: '/images/matric-studio.webp',
    status: 'development'
  },
  // Infrastructure Tooling
  {
    id: 'time-at-the-edge',
    name: 'Timing Edge Node',
    description: 'Distributed timing infrastructure providing nanosecond precision at network edge nodes',
    category: 'infrastructure-tooling',
    type: 'Timing Infrastructure',
    image: '/images/time-at-the-edge.webp',
    status: 'beta'
  },
  {
    id: 'the-egg',
    name: 'The Egg',
    description: 'Advanced robotic coordination system enabling seamless multi-agent orchestration and task execution',
    category: 'infrastructure-tooling',
    type: 'Robit Project',
    image: '/images/the-egg.webp',
    status: 'development'
  }
];

// Testimonials removed - Issue #7

const integrations: Integration[] = [
  {
    name: 'Enterprise APIs',
    description: 'RESTful APIs for enterprise integration',
    icon: BuildingOfficeIcon,
    status: 'coming-soon'
  },
  {
    name: 'No-Code Audited Smart Contracts',
    description: 'No-Code Audited Smart Contracts via partnership with Selfient',
    icon: CubeIcon,
    status: 'coming-soon'
  },
  {
    name: 'Real-time Oracles',
    description: 'Sub-millisecond data feeds',
    icon: ClockIcon,
    status: 'coming-soon'
  },
  {
    name: 'Payment Rails',
    description: 'Instant settlement infrastructure',
    icon: BanknotesIcon,
    status: 'coming-soon'
  }
];

export const Ecosystem: FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'partners' | 'service-providers' | 'built-on'>('all');
  // Testimonial state removed - Issue #7

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

  const filteredPartners = selectedCategory === 'all'
    ? partners
    : partners.filter(partner => partner.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return '#00d4aa';
      case 'beta': return '#f59e0b';
      case 'coming-soon': return '#BAC0CC';
      case 'development': return '#9333ea';
      default: return '#BAC0CC';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'live': return 'Live';
      case 'beta': return 'Beta';
      case 'coming-soon': return 'Coming Soon';
      case 'development': return 'In Development';
      default: return 'Unknown';
    }
  };

  return (
    <section
      ref={ref}
      className={styles.ecosystem}
      role="region"
      aria-label="ROKO Network ecosystem and partnerships"
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
            <span className={styles.gradientText}>Thriving</span>
            <br />
            Ecosystem
          </h2>
          <p className={styles.subtitle}>
            Join a growing community of developers, enterprises, and innovators
            building the future of temporal blockchain technology.
          </p>
        </motion.div>

        {/* Featured Partners */}
        <motion.div
          className={styles.partnersSection}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.sectionHeader} variants={itemVariants}>
            <h3>Ecosystem Partners</h3>
            <p>Organizations collaborating to build the future of precision timing technology</p>
          </motion.div>

          {/* Category Filters */}
          <motion.div className={styles.categoryFilters} variants={itemVariants}>
            {(['all', 'partners', 'service-providers', 'built-on'] as const).map((category) => (
              <button
                key={category}
                className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all'
                  ? 'All'
                  : category === 'service-providers'
                  ? 'Service Providers'
                  : category === 'built-on'
                  ? 'Built On'
                  : 'Partners'
                }
              </button>
            ))}
          </motion.div>

          {/* Partners Grid */}
          <motion.div className={styles.partnersGrid} variants={itemVariants}>
            {filteredPartners.map((partner, index) => (
              <motion.div
                key={partner.id}
                className={`${styles.partnerCard} ${partner.featured ? styles.featured : ''}`}
                whileHover={{ y: -4, boxShadow: '0 8px 40px rgba(0, 212, 170, 0.2)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.partnerLogo}>
                  <div className={styles.logoPlaceholder}>
                    {partner.name.charAt(0)}
                  </div>
                </div>
                <div className={styles.partnerContent}>
                  <h4 className={styles.partnerName}>{partner.name}</h4>
                  <span className={styles.partnerCategory}>{partner.category}</span>
                  <p className={styles.partnerDescription}>{partner.description}</p>
                  {partner.website && (
                    <a
                      href={partner.website}
                      className={styles.partnerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                      <ArrowTopRightOnSquareIcon className={styles.linkIcon} />
                    </a>
                  )}
                </div>
                {partner.featured && (
                  <div className={styles.featuredBadge}>
                    <StarIcon className={styles.starIcon} />
                    Featured
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Featured Solutions */}
        <motion.div
          className={styles.solutionsSection}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.sectionHeader} variants={itemVariants}>
            <h3>Featured Solutions</h3>
            <p>Innovative applications and infrastructure being developed on ROKO Network</p>
          </motion.div>

          <motion.div className={styles.solutionsGrid} variants={itemVariants}>
            {featuredSolutions.map((solution, index) => (
              <motion.div
                key={solution.id}
                className={styles.solutionCard}
                whileHover={{ scale: 1.02, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className={styles.solutionImage}>
                  <div className={styles.imagePlaceholder}>
                    {solution.name.split(' ').map(word => word.charAt(0)).join('')}
                  </div>
                  <div className={styles.solutionStatus} style={{ color: getStatusColor(solution.status) }}>
                    {getStatusLabel(solution.status)}
                  </div>
                </div>
                <div className={styles.solutionContent}>
                  <div className={styles.solutionHeader}>
                    <h4 className={styles.solutionName}>{solution.name}</h4>
                    <span className={styles.solutionCategory}>
                      {solution.category === 'dapps' ? 'dApp' : 'Infrastructure'}
                    </span>
                  </div>
                  <p className={styles.solutionDescription}>{solution.description}</p>
                  {solution.type && (
                    <div className={styles.solutionType}>
                      <CubeIcon className={styles.typeIcon} />
                      <span>{solution.type}</span>
                    </div>
                  )}
                  {solution.website && (
                    <a
                      href={solution.website}
                      className={styles.solutionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn More
                      <ArrowTopRightOnSquareIcon className={styles.linkIcon} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Success Stories section removed - Issue #7 */}

        {/* Integration Examples */}
        <motion.div
          className={styles.integrationsSection}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.sectionHeader} variants={itemVariants}>
            <h3>Integration Options</h3>
            <p>BETA</p>
          </motion.div>

          <motion.div className={styles.integrationsGrid} variants={itemVariants}>
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                className={styles.integrationCard}
                whileHover={{ y: -2, borderColor: '#00d4aa' }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.integrationIcon}>
                  <integration.icon className={styles.icon} />
                </div>
                <h4 className={styles.integrationName}>{integration.name}</h4>
                <p className={styles.integrationDescription}>{integration.description}</p>
                <div
                  className={styles.integrationStatus}
                  style={{ color: getStatusColor(integration.status) }}
                >
                  {getStatusLabel(integration.status)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Partnership CTA */}
        <motion.div
          className={styles.partnershipCta}
          variants={itemVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <div className={styles.ctaContent}>
            <h3>Join Our Ecosystem</h3>
            <p>
              Ready to build on ROKO Network? Join our growing ecosystem of partners
              and developers creating the future of temporal blockchain technology.
            </p>
            <div className={styles.ctaButtons}>
              <motion.button
                className={styles.primaryButton}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Become a Partner
              </motion.button>
              <motion.button
                className={styles.secondaryButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Integration Docs
              </motion.button>
            </div>
          </div>
          <div className={styles.ctaVisual}>
            <GlobeAltIcon className={styles.globeIcon} />
          </div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.meshPattern} />
        <div className={styles.floatingOrbs} />
      </div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite">
        {/* Screen reader announcement removed */}
      </div>
    </section>
  );
};

export default Ecosystem;