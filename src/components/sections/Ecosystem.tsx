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
  category: 'enterprise' | 'defi' | 'infrastructure' | 'dapp';
  description: string;
  logo: string;
  website?: string;
  featured?: boolean;
}

interface DApp {
  id: string;
  name: string;
  description: string;
  category: 'defi' | 'gaming' | 'nft' | 'infrastructure' | 'social';
  users: string;
  tvl?: string;
  image: string;
  status: 'live' | 'beta' | 'coming-soon';
}

interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

interface Integration {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'live' | 'beta' | 'coming-soon';
}

const partners: Partner[] = [
  {
    id: 'temporal-tech',
    name: 'Temporal Technologies',
    category: 'enterprise',
    description: 'Enterprise blockchain solutions with nanosecond precision',
    logo: '/logos/temporal-tech.svg',
    website: 'https://temporal.tech',
    featured: true
  },
  {
    id: 'chainlink',
    name: 'Chainlink',
    category: 'infrastructure',
    description: 'Oracle network providing external data to ROKO smart contracts',
    logo: '/logos/chainlink.svg',
    website: 'https://chainlink.network',
    featured: true
  },
  {
    id: 'finance-corp',
    name: 'Global Finance Corp',
    category: 'enterprise',
    description: 'Traditional finance embracing temporal blockchain technology',
    logo: '/logos/finance-corp.svg',
    featured: false
  },
  {
    id: 'defi-protocol',
    name: 'TemporalDeFi',
    category: 'defi',
    description: 'Precision lending and borrowing with time-based liquidations',
    logo: '/logos/temporal-defi.svg',
    featured: true
  },
  {
    id: 'iot-systems',
    name: 'IoT Systems Inc',
    category: 'infrastructure',
    description: 'Industrial IoT systems requiring nanosecond synchronization',
    logo: '/logos/iot-systems.svg',
    featured: false
  },
  {
    id: 'gaming-studio',
    name: 'Temporal Gaming',
    category: 'dapp',
    description: 'Real-time multiplayer games with precise timing mechanics',
    logo: '/logos/temporal-gaming.svg',
    featured: false
  }
];

const featuredDApps: DApp[] = [
  {
    id: 'temporal-dex',
    name: 'TemporalDEX',
    description: 'High-frequency trading with nanosecond execution guarantees',
    category: 'defi',
    users: '12.5K',
    tvl: '$45.2M',
    image: '/images/temporal-dex.webp',
    status: 'live'
  },
  {
    id: 'sync-nft',
    name: 'SyncNFT',
    description: 'Time-synchronized NFT marketplace for temporal collectibles',
    category: 'nft',
    users: '8.9K',
    image: '/images/sync-nft.webp',
    status: 'live'
  },
  {
    id: 'precision-oracle',
    name: 'PrecisionOracle',
    description: 'Real-time data feeds with temporal accuracy validation',
    category: 'infrastructure',
    users: '156',
    image: '/images/precision-oracle.webp',
    status: 'beta'
  },
  {
    id: 'temporal-quest',
    name: 'TemporalQuest',
    description: 'MMO RPG with real-time synchronized gameplay',
    category: 'gaming',
    users: '25.1K',
    image: '/images/temporal-quest.webp',
    status: 'coming-soon'
  }
];

const testimonials: Testimonial[] = [
  {
    id: 'sarah-chen',
    author: 'Sarah Chen',
    role: 'CTO',
    company: 'Temporal Technologies',
    content: 'ROKO\'s nanosecond precision has revolutionized our real-time trading infrastructure. The reliability and accuracy are unmatched in the blockchain space.',
    avatar: '/avatars/sarah-chen.jpg',
    rating: 5
  },
  {
    id: 'marcus-rodriguez',
    author: 'Marcus Rodriguez',
    role: 'Lead Developer',
    company: 'TemporalDeFi',
    content: 'Building on ROKO has been incredible. The temporal guarantees allow us to create DeFi products that were previously impossible on other chains.',
    avatar: '/avatars/marcus-rodriguez.jpg',
    rating: 5
  },
  {
    id: 'alexandra-kim',
    author: 'Alexandra Kim',
    role: 'Head of Infrastructure',
    company: 'IoT Systems Inc',
    content: 'Our industrial IoT systems require precise timing. ROKO delivers the nanosecond accuracy we need for critical operations.',
    avatar: '/avatars/alexandra-kim.jpg',
    rating: 5
  }
];

const integrations: Integration[] = [
  {
    name: 'Enterprise APIs',
    description: 'RESTful APIs for enterprise integration',
    icon: BuildingOfficeIcon,
    status: 'live'
  },
  {
    name: 'Smart Contracts',
    description: 'Temporal-aware contract development',
    icon: CubeIcon,
    status: 'live'
  },
  {
    name: 'Real-time Oracles',
    description: 'Sub-millisecond data feeds',
    icon: ClockIcon,
    status: 'beta'
  },
  {
    name: 'Payment Rails',
    description: 'Instant settlement infrastructure',
    icon: BanknotesIcon,
    status: 'live'
  }
];

export const Ecosystem: FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'enterprise' | 'defi' | 'infrastructure' | 'dapp'>('all');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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
      default: return '#BAC0CC';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'live': return 'Live';
      case 'beta': return 'Beta';
      case 'coming-soon': return 'Coming Soon';
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
            <h3>Trusted Partners</h3>
            <p>Leading organizations building on ROKO Network</p>
          </motion.div>

          {/* Category Filters */}
          <motion.div className={styles.categoryFilters} variants={itemVariants}>
            {(['all', 'enterprise', 'defi', 'infrastructure', 'dapp'] as const).map((category) => (
              <button
                key={category}
                className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
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
                  <img src={partner.logo} alt={`${partner.name} logo`} />
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

        {/* Featured dApps */}
        <motion.div
          className={styles.dappsSection}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.sectionHeader} variants={itemVariants}>
            <h3>Featured dApps</h3>
            <p>Innovative applications leveraging temporal precision</p>
          </motion.div>

          <motion.div className={styles.dappsGrid} variants={itemVariants}>
            {featuredDApps.map((dapp, index) => (
              <motion.div
                key={dapp.id}
                className={styles.dappCard}
                whileHover={{ scale: 1.02, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className={styles.dappImage}>
                  <img src={dapp.image} alt={`${dapp.name} interface`} />
                  <div className={styles.dappStatus} style={{ color: getStatusColor(dapp.status) }}>
                    {getStatusLabel(dapp.status)}
                  </div>
                </div>
                <div className={styles.dappContent}>
                  <div className={styles.dappHeader}>
                    <h4 className={styles.dappName}>{dapp.name}</h4>
                    <span className={styles.dappCategory}>{dapp.category}</span>
                  </div>
                  <p className={styles.dappDescription}>{dapp.description}</p>
                  <div className={styles.dappStats}>
                    <div className={styles.dappStat}>
                      <UserGroupIcon className={styles.statIcon} />
                      <span>{dapp.users} users</span>
                    </div>
                    {dapp.tvl && (
                      <div className={styles.dappStat}>
                        <BanknotesIcon className={styles.statIcon} />
                        <span>{dapp.tvl} TVL</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Success Stories / Testimonials */}
        <motion.div
          className={styles.testimonialsSection}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.sectionHeader} variants={itemVariants}>
            <h3>Success Stories</h3>
            <p>What builders are saying about ROKO Network</p>
          </motion.div>

          <motion.div className={styles.testimonialsContainer} variants={itemVariants}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <div className={styles.rating}>
                  {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                    <StarIcon key={i} className={styles.starIcon} />
                  ))}
                </div>
                <blockquote className={styles.testimonialText}>
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
                <div className={styles.testimonialAuthor}>
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].author}
                    className={styles.authorAvatar}
                  />
                  <div className={styles.authorInfo}>
                    <div className={styles.authorName}>
                      {testimonials[activeTestimonial].author}
                    </div>
                    <div className={styles.authorRole}>
                      {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.testimonialNav}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.navDot} ${activeTestimonial === index ? styles.active : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Integration Examples */}
        <motion.div
          className={styles.integrationsSection}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.sectionHeader} variants={itemVariants}>
            <h3>Integration Options</h3>
            <p>Multiple ways to connect with ROKO Network</p>
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
        {inView && 'Ecosystem section loaded with partners, dApps, and testimonials'}
      </div>
    </section>
  );
};

export default Ecosystem;