import React, { FC, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  BuildingOfficeIcon,
  CubeIcon,
  ClockIcon,
  BanknotesIcon,
  GlobeAltIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import styles from './Ecosystem.module.css';
import Footer from '../../components/organisms/Footer';

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

interface Integration {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'live' | 'beta' | 'coming-soon';
}

/** Normalize logo paths */
const normalizeLogoSrc = (p?: string) => {
  if (!p) return '';
  if (/^(https?:)?\/\//i.test(p) || p.startsWith('data:')) return p;
  return p.replace(/^\/?public\//, '/');
};

const filenameSuggestsLight = (path: string) =>
  /(^|\/)(?:.*(?:white|light|inverse|inverted|neg|negative))\.(?:svg|png|webp|jpg|jpeg)$/i.test(path);

const filenameSuggestsDark = (path: string) =>
  /(^|\/)(?:.*(?:black|dark))\.(?:svg|png|webp|jpg|jpeg)$/i.test(path);

const analyzeLuminance = (img: HTMLImageElement) => {
  const w = Math.max(1, Math.min(64, img.naturalWidth || img.width || 1));
  const h = Math.max(1, Math.min(64, Math.round((img.naturalHeight || img.height || 1) * (w / (img.naturalWidth || img.width || 1)))));
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('no-2d');
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;

  let sum = 0, count = 0, opaqueCount = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255;
    if (a > 0.1) {
      const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
      const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      sum += y; count++;
      if (a > 0.98) opaqueCount++;
    }
  }
  if (!count) return { avg: 0, coverage: 0 };
  return { avg: sum / count, coverage: opaqueCount / (w * h) };
};

const shouldInvert = (img: HTMLImageElement, src: string) => {
  if (filenameSuggestsDark(src)) return false;
  if (filenameSuggestsLight(src)) return true;
  try {
    const { avg, coverage } = analyzeLuminance(img);
    return avg >= 0.82 && coverage < 0.85;
  } catch {
    return filenameSuggestsLight(src);
  }
};

const partners: Partner[] = [
  { id: 'time-beat', name: 'Time Beat', category: 'service-providers', description: 'An End-To-End Timing & IEEE-1588 Clock sync ecosystem provider.', logo: '/logos/timebeat.svg', website: 'https://www.timebeat.app', featured: true },
  { id: 'unforkable', name: 'Unforkable', category: 'partners', description: 'DeFi engineering specialists building secure smart contracts and full-stack solutions', logo: '/logos/unfork.png', website: 'https://unforkable.co', featured: false },
  { id: 'community', name: 'Roko Community', category: 'partners', description: 'All of our supporters and incredible longstanding community members who have made all of this possible.', logo: '/logos/favicon-roko.png', website: '', featured: true },
  { id: 'hyperspawn', name: 'Hyperspawn Robotics', category: 'partners', description: 'Low cost robotics systems, manufacturing, testing, and deploying experimental control policies for an open-source bipedal robot named Dropbear.', logo: '/logos/hyperspawn.png', website: 'https://www.hyperspawn.co', featured: true },
  { id: 'fractional-robots', name: 'Fractional Robots', category: 'partners', description: 'Think tank and rapid prototyping focused on the development of AI powered software and hardware..', logo: '/logos/dropbear.png', website: 'https://fractionalrobots.com', featured: true },
  { id: 'selfient', name: 'Selfient', category: 'partners', description: 'EVM blockchain technology company providing no-code smart contract creation tools', logo: '/logos/selfient.svg', website: 'https://www.selfient.xyz', featured: true },
  { id: 'exa-group', name: 'Exa Group', category: 'partners', description: 'Comprehensive treasury management and strategic investment advisory to protect and grow your digital assets through battle-tested strategies and cutting-edge technology.', logo: '/logos/ExaWhite.png', website: 'https://www.exagroup.xyz', featured: true },
  { id: 'trustid', name: 'TrustID', category: 'partners', description: 'The new standard for consent and identity management. Portable across the web. Trusted by AI. Built for growth.', logo: '/logos/trustid.svg', website: 'https://www.trustid.life/business', featured: false },
  { id: 'integro', name: 'Integro', category: 'partners', description: 'AI orchestration and custom automation solutions provider.', logo: '/logos/integro.png', website: 'https://integrolabs.io', featured: false },
  { id: 'iskout', name: 'Iskout', category: 'service-providers', description: 'Rapid precision hiring and talent acquisition specialists for tech companies', logo: '/logos/iskout.png', website: 'https://www.iskout.com', featured: false },
  { id: 'ocp-tap', name: 'OCP TAP', category: 'built-on', description: 'Open Compute Project Time Appliances providing IEEE 1588 PTP timing infrastructure', logo: '/logos/ocp.svg', website: 'https://www.opencompute.org/projects/time-appliances-project-tap', featured: true },
  { id: 'polkadot', name: 'Polkadot', category: 'built-on', description: 'Highly customizable, chain-agnostic modular architecture and an extensive suite of tools and libraries, enabling next-level blockchain innovation.', logo: '/logos/polkadot.png', website: 'https://polkadot.com/platform/sdk', featured: true }
];

const featuredSolutions: Solution[] = [
  { id: 'matric-studio', name: 'Matric Studio', description: 'Application framework for developing orchestration pipelines to coordinate systems and agentic models', category: 'dapps', type: 'Application Framework', image: '/images/matric-studio.webp', status: 'development' },
  { id: 'time-at-the-edge', name: 'Timing Edge Node', description: 'Distributed timing infrastructure providing nanosecond precision at network edge nodes', category: 'infrastructure-tooling', type: 'Timing Infrastructure', image: '/images/time-at-the-edge.webp', status: 'beta' },
  { id: 'the-egg', name: 'The Egg', description: 'Advanced robotic coordination system enabling seamless multi-agent orchestration and task execution', category: 'infrastructure-tooling', type: 'Robit Project', image: '/images/the-egg.webp', status: 'development' }
];

const integrations: Integration[] = [
  { name: 'Enterprise APIs', description: 'RESTful APIs for enterprise integration', icon: BuildingOfficeIcon, status: 'coming-soon' },
  { name: 'No-Code Audited Smart Contracts', description: 'No-Code Audited Smart Contracts via partnership with Selfient', icon: CubeIcon, status: 'coming-soon' },
  { name: 'Real-time Oracles', description: 'Sub-millisecond data feeds', icon: ClockIcon, status: 'coming-soon' },
  { name: 'Payment Rails', description: 'Instant settlement infrastructure', icon: BanknotesIcon, status: 'coming-soon' }
];

export const Ecosystem: FC = () => {
  const fallbackInView = typeof window === 'undefined' ? true : !('IntersectionObserver' in window);
  const [observerRef, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '120px 0px',
    fallbackInView,
  });

  const sectionRef = useRef<HTMLElement | null>(null);
  const setSectionRef = useCallback((node: HTMLElement | null) => {
    sectionRef.current = node;
    observerRef(node);
  }, [observerRef]);

  const [hasBeenVisible, setHasBeenVisible] = useState(() => fallbackInView);

  useEffect(() => {
    if (inView) {
      setHasBeenVisible(true);
    }
  }, [inView]);

  // Safari/Brave occasionally fail the IntersectionObserver when the section lives in a nested scroll container.
  // Manually check the bounding box as a safety net so content never stays hidden.
  const ensureVisible = useCallback(() => {
    const el = sectionRef.current;
    if (!el || typeof window === 'undefined') return;

    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement?.clientHeight || 0;

    if (rect.top <= viewportHeight * 0.95 && rect.bottom >= viewportHeight * 0.05) {
      setHasBeenVisible(true);
    }
  }, []);

  useEffect(() => {
    if (hasBeenVisible || typeof window === 'undefined') return;

    ensureVisible();

    const scrollContainer = sectionRef.current?.closest('[data-scroll-container]') as (HTMLElement | null);
    const scrollTarget: HTMLElement | (Window & typeof globalThis) = scrollContainer ?? window;

    const handleScroll = () => ensureVisible();
    const handleResize = () => ensureVisible();

    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [ensureVisible, hasBeenVisible]);

  const isVisible = hasBeenVisible || inView;
  const [selectedCategory, setSelectedCategory] =
    useState<'all' | 'partners' | 'service-providers' | 'built-on'>('all');

  const [invertMap, setInvertMap] = useState<Record<string, boolean>>({});
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({}); // ensure visible immediately

  const filteredPartners = useMemo(
    () => (selectedCategory === 'all' ? partners : partners.filter(p => p.category === selectedCategory)),
    [selectedCategory]
  );

  // Preload currently visible partner logos to avoid Safari/transform lazy glitches
  useEffect(() => {
    filteredPartners.forEach(p => {
      const src = normalizeLogoSrc(p.logo);
      if (!src) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      // When it loads, mark as loaded to force opacity 1 immediately
      img.onload = () => setLoadedMap(prev => (prev[p.id] ? prev : { ...prev, [p.id]: true }));
    });
  }, [filteredPartners]);

  const handleLogoLoad = useCallback(
    (id: string, src: string, e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      // compute invert
      const invert = shouldInvert(img, src);
      setInvertMap(prev => (prev[id] === invert ? prev : { ...prev, [id]: invert }));
      // mark as loaded (ensures opacity)
      setLoadedMap(prev => (prev[id] ? prev : { ...prev, [id]: true }));
    },
    []
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
  };

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
      ref={setSectionRef}
      className={styles.ecosystem}
      role="region"
      aria-label="ROKO Network ecosystem and partnerships"
      // Make the section a flex column so the footer can sit at the bottom of the page/slide.
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}
    >
      <div className={styles.container} style={{ flex: '1 0 auto' }}>
        {/* Header */}
        <motion.div className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
          <h2 className={styles.title}><span className={styles.gradientText}>Thriving Ecosystem</span></h2>
          <p className={styles.subtitle}>Join a growing community of developers, enterprises, and innovators
            building the future of temporal blockchain technology.</p>
        </motion.div>

        {/* Partners */}
        <motion.div className={styles.partnersSection} variants={containerVariants} initial="hidden" animate={isVisible ? 'visible' : 'hidden'}>
          <motion.div className={styles.categoryFilters} variants={itemVariants}>
            {(['all', 'partners', 'service-providers', 'built-on'] as const).map((category) => (
              <button
                key={category}
                className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All' : category === 'service-providers' ? 'Service Providers' : category === 'built-on' ? 'Built On' : 'Partners'}
              </button>
            ))}
          </motion.div>

          <motion.div className={styles.partnersGrid} variants={itemVariants}>
            {filteredPartners.map((partner) => {
              const src = normalizeLogoSrc(partner.logo);
              const invert = !!invertMap[partner.id];
              const loaded = !!loadedMap[partner.id];

              const Wrapper: any = partner.website ? motion.a : motion.div;
              const wrapperProps = partner.website
                ? { href: partner.website, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `Open ${partner.name} website` }
                : { role: 'article', tabIndex: 0, 'aria-label': partner.name };

              return (
                <Wrapper
                  key={partner.id}
                  {...wrapperProps}
                  className={`${styles.partnerCard} ${partner.featured ? styles.featured : ''}`}
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                >
                  <div className={styles.partnerLogo}>
                    <img
                      src={src}
                      alt={`${partner.name} logo`}
                      decoding="async"
                      crossOrigin="anonymous"
                      className={styles.logoImg}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        opacity: loaded ? 1 : 1,
                        filter: invert ? 'invert(1)' : undefined,
                        transition: 'filter 160ms ease'
                      }}
                      data-inverted={invert ? 'true' : 'false'}
                      data-loaded={loaded ? 'true' : 'false'}
                      onLoad={(e) => handleLogoLoad(partner.id, src, e)}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div className={styles.partnerContent}>
                    <div className={styles.row}>
                      <h4 className={styles.partnerName}>{partner.name}</h4>
                      <span className={styles.partnerCategory}>{partner.category}</span>
                    </div>
                    <p className={styles.partnerDescription}>{partner.description}</p>
                  </div>

                  {partner.featured && (
                    <div className={styles.featuredBadge}>
                      <StarIcon className={styles.starIcon} />
                      Featured
                    </div>
                  )}
                </Wrapper>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Featured Solutions */}
        <motion.div className={styles.solutionsSection} variants={containerVariants} initial="hidden" animate={isVisible ? 'visible' : 'hidden'}>
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
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Integrations */}
        <motion.div className={styles.integrationsSection} variants={containerVariants} initial="hidden" animate={isVisible ? 'visible' : 'hidden'}>
          <motion.div className={styles.sectionHeader} variants={itemVariants}>
            <h3>Integration Options</h3>
            <p>BETA</p>
          </motion.div>

          <motion.div className={styles.integrationsGrid} variants={itemVariants}>
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                className={styles.integrationCard}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.integrationIcon}>
                  <integration.icon className={styles.icon} />
                </div>
                <h4 className={styles.integrationName}>{integration.name}</h4>
                <p className={styles.integrationDescription}>{integration.description}</p>
                <div className={styles.integrationStatus} style={{ color: getStatusColor(integration.status) }}>
                  {getStatusLabel(integration.status)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div className={styles.partnershipCta} variants={itemVariants} initial="hidden" animate={isVisible ? 'visible' : 'hidden'}>
          <div className={styles.ctaContent}>
            <h3>Join Our Ecosystem</h3>
            <p>
              Ready to build on ROKO Network? Join our growing ecosystem of partners
              and developers creating the future of temporal blockchain technology.
            </p>
            <div className={styles.ctaButtons}>
              <motion.button className={styles.primaryButton} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                Become a Partner
              </motion.button>
              <motion.button className={styles.secondaryButton} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                View Integration Docs
              </motion.button>
            </div>
          </div>
          <div className={styles.ctaVisual}>
            <img src="favicon-roko.png" className={styles.rokoIcon} alt="" />
          </div>
        </motion.div>
      </div>

      {/* Background Elements (likely decorative/absolute). Keep in DOM but below footer z-index. */}
      <div className={styles.backgroundElements} aria-hidden="true">
        <div className={styles.meshPattern} />
        <div className={styles.floatingOrbs} />
      </div>

      {/* FOOTER pinned to the bottom of the section/slide via flex + margin-top:auto */}
      <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>

      <div className="sr-only" aria-live="polite" />
    </section>
  );
};

export default Ecosystem;
