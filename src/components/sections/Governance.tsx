import { FC, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  BanknotesIcon,
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useGovernanceData } from '../../hooks/useProposals';
import { GovernanceProposal } from '../../services/governance/types';
import styles from './Governance.module.css';

// Fallback data when API is unavailable
const fallbackStats = {
  totalSupply: '1,000,000,000',
  totalHolders: '89,432',
  avgVotingPower: '2.8%',
  activeProposals: 0,
  totalProposals: 0,
  participationRate: '0%'
};

const fallbackProposals: GovernanceProposal[] = [
  {
    id: 'fallback-001',
    title: 'Loading Proposals...',
    description: 'Fetching latest governance proposals from Snapshot...',
    status: 'pending',
    votesFor: 0,
    votesAgainst: 0,
    quorum: 0,
    timeRemaining: 'Loading...',
    category: 'other',
    choices: ['For', 'Against'],
    scores: [0, 0],
    totalVotes: 0,
    startTime: new Date(),
    endTime: new Date(),
    author: '',
    snapshotHeight: ''
  }
];

export const Governance: FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);

  // Fetch real governance data from Snapshot
  const { proposals, stats, loading, error, refetch } = useGovernanceData();

  // Use fallback data when loading or on error
  const displayProposals = useMemo(() => {
    if (loading) return fallbackProposals;
    if (error || !proposals || proposals.length === 0) {
      return fallbackProposals.map(p => ({
        ...p,
        title: error ? 'Error Loading Proposals' : 'No Proposals Available',
        description: error ? 'Failed to load proposals from Snapshot API' : 'No governance proposals found for this space'
      }));
    }
    return proposals.slice(0, 10); // Show first 10 proposals
  }, [loading, error, proposals]);

  const displayStats = stats || fallbackStats;

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

  const progressVariants = {
    hidden: { width: 0 },
    visible: (percentage: number) => ({
      width: `${percentage}%`,
      transition: {
        duration: 1.5,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.5
      }
    })
  };

  const getProposalProgress = (proposal: GovernanceProposal) => {
    const totalVotes = proposal.votesFor + proposal.votesAgainst + (proposal.abstain || 0);
    const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
    const quorumProgress = proposal.quorum > 0 ? (totalVotes / proposal.quorum) * 100 : 0;
    return { forPercentage, quorumProgress: Math.min(quorumProgress, 100) };
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
  };

  return (
    <section
      ref={ref}
      className={styles.governance}
      role="region"
      aria-label="ROKO Network DAO governance"
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
            <span className={styles.gradientText}>Decentralized</span>
            <br />
            Governance
          </h2>
          <p className={styles.subtitle}>
            Community-driven decision making powered by pwROKO voting rights.
            Participate in shaping the future of temporal blockchain infrastructure.
          </p>
        </motion.div>

        {/* DAO Stats Grid */}
        <motion.div
          className={styles.statsGrid}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>
              <BanknotesIcon className={styles.icon} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{displayStats.totalSupply}</div>
              <div className={styles.statLabel}>Total ROKO Supply</div>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>
              <ChartBarIcon className={styles.icon} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{displayStats.activeProposals}</div>
              <div className={styles.statLabel}>Active Proposals</div>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>
              <UsersIcon className={styles.icon} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{displayStats.totalHolders}</div>
              <div className={styles.statLabel}>Token Holders</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          className={styles.contentGrid}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Proposals Section */}
          <motion.div className={styles.proposalsSection} variants={itemVariants}>
            <div className={styles.sectionHeader}>
              <div className={styles.headerContent}>
                <h3>Governance Proposals</h3>
                <p>Community proposals from Snapshot</p>
              </div>
              <div className={styles.headerActions}>
                {error && (
                  <motion.button
                    className={styles.retryButton}
                    onClick={refetch}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Retry loading proposals"
                  >
                    <ArrowPathIcon className={styles.retryIcon} />
                    Retry
                  </motion.button>
                )}
                {loading && (
                  <div className={styles.loadingIndicator}>
                    <ArrowPathIcon className={`${styles.loadingIcon} ${styles.spinning}`} />
                    Loading...
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className={styles.errorBanner}>
                <ExclamationTriangleIcon className={styles.errorIcon} />
                <div className={styles.errorContent}>
                  <p className={styles.errorTitle}>Failed to load proposals</p>
                  <p className={styles.errorMessage}>
                    Unable to connect to Snapshot API. Showing fallback content.
                  </p>
                </div>
              </div>
            )}

            <div className={styles.proposalsList}>
              {displayProposals.map((proposal) => {
                const { forPercentage, quorumProgress } = getProposalProgress(proposal);

                return (
                  <motion.div
                    key={proposal.id}
                    className={`${styles.proposalCard} ${
                      selectedProposal === proposal.id ? styles.selected : ''
                    }`}
                    whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0, 212, 170, 0.2)' }}
                    onClick={() => setSelectedProposal(
                      selectedProposal === proposal.id ? null : proposal.id
                    )}
                  >
                    <div className={styles.proposalHeader}>
                      <div className={styles.proposalMeta}>
                        <span className={`${styles.status} ${styles[proposal.status]}`}>
                          {proposal.status.toUpperCase()}
                        </span>
                        <span className={styles.category}>{proposal.category}</span>
                      </div>
                      <div className={styles.timeRemaining}>
                        <ClockIcon className={styles.timeIcon} />
                        {proposal.timeRemaining}
                      </div>
                    </div>

                    <h4 className={styles.proposalTitle}>{proposal.title}</h4>
                    <p className={styles.proposalDescription}>{proposal.description}</p>

                    <div className={styles.votingProgress}>
                      <div className={styles.progressSection}>
                        <div className={styles.progressLabel}>
                          <span>Support</span>
                          <span>{forPercentage.toFixed(1)}%</span>
                        </div>
                        <div className={styles.progressBar}>
                          <motion.div
                            className={styles.progressFill}
                            custom={forPercentage}
                            variants={progressVariants}
                            initial="hidden"
                            animate={inView ? 'visible' : 'hidden'}
                          />
                        </div>
                      </div>

                      <div className={styles.progressSection}>
                        <div className={styles.progressLabel}>
                          <span>Quorum</span>
                          <span>{quorumProgress.toFixed(1)}%</span>
                        </div>
                        <div className={styles.progressBar}>
                          <motion.div
                            className={`${styles.progressFill} ${styles.quorum}`}
                            custom={quorumProgress}
                            variants={progressVariants}
                            initial="hidden"
                            animate={inView ? 'visible' : 'hidden'}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.voteStats}>
                      <div className={styles.voteStat}>
                        <span className={styles.voteCount}>{formatNumber(proposal.votesFor)}</span>
                        <span className={styles.voteLabel}>For</span>
                      </div>
                      <div className={styles.voteStat}>
                        <span className={styles.voteCount}>{formatNumber(proposal.votesAgainst)}</span>
                        <span className={styles.voteLabel}>Against</span>
                      </div>
                    </div>

                    {proposal.status === 'active' && !loading && !error && (
                      <div className={styles.voteButtons}>
                        <motion.button
                          className={styles.voteFor}
                          onClick={() => window.open(`https://snapshot.org/#/rokonetwork.eth/proposal/${proposal.id}`, '_blank', 'noopener,noreferrer')}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Vote For
                        </motion.button>
                        <motion.button
                          className={styles.voteAgainst}
                          onClick={() => window.open(`https://snapshot.org/#/rokonetwork.eth/proposal/${proposal.id}`, '_blank', 'noopener,noreferrer')}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Vote Against
                        </motion.button>
                      </div>
                    )}

                    {!loading && !error && proposal.status !== 'active' && (
                      <div className={styles.viewProposalButton}>
                        <motion.button
                          className={styles.secondaryButton}
                          onClick={() => window.open(`https://snapshot.org/#/rokonetwork.eth/proposal/${proposal.id}`, '_blank', 'noopener,noreferrer')}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          View Details
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Sidebar Section - Staking & Treasury removed */}
          <motion.div className={styles.sidebarSection} variants={itemVariants}>
            <div className={styles.placeholderContent}>
              <p className={styles.placeholderText}>
                Additional governance features coming soon...
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Join DAO CTA */}
        <motion.div
          className={styles.joinDaoCta}
          variants={itemVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h3>Join the ROKO DAO</h3>
          <p>
            Become part of the decentralized governance that shapes the future of temporal blockchain.
            Join the community to help guide network development.
          </p>
          <div className={styles.ctaButtons}>
            <motion.button
              className={styles.primaryButton}
              onClick={() => window.open('https://app.uniswap.org/explore/tokens/ethereum/0x6f222e04f6c53cc688ffb0abe7206aac66a8ff98', '_blank', 'noopener,noreferrer')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Get ROKO Tokens
            </motion.button>
            <motion.button
              className={styles.secondaryButton}
              onClick={() => window.open('https://snapshot.org/#/rokonetwork.eth', '_blank', 'noopener,noreferrer')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn About Governance
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.networkPattern} />
        <div className={styles.glowOrb} />
      </div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite">
        {/* Screen reader announcement removed */}
      </div>
    </section>
  );
};

export default Governance;