import { FC, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  BanknotesIcon,
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TrophyIcon
  // DocumentTextIcon, ShieldCheckIcon removed - Issues #13, #15
} from '@heroicons/react/24/outline';
import styles from './Governance.module.css';

interface DAOStats {
  totalSupply: string;
  totalHolders: string;
  avgVotingPower: string;
  // Staking, validator, and treasury data removed
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'failed' | 'pending';
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  timeRemaining: string;
  category: 'treasury' | 'governance' | 'technical' | 'community';
}

// TreasuryAllocation interface removed - Issue #14

const daoStats: DAOStats = {
  totalSupply: '1,000,000,000',
  totalHolders: '89,432',
  avgVotingPower: '2.8%'
  // Staking, validator, and treasury data removed
};

const mockProposals: Proposal[] = [
  {
    id: 'prop-001',
    title: 'Increase Validator Node Requirements',
    description: 'Proposal to increase minimum hardware requirements for validator nodes to improve network performance.',
    status: 'active',
    votesFor: 4500000,
    votesAgainst: 1200000,
    quorum: 5000000,
    timeRemaining: '5 days',
    category: 'technical'
  },
  {
    id: 'prop-002',
    title: 'Community Grant Program Funding',
    description: 'Allocate 5M ROKO tokens for developer grants and ecosystem development initiatives.',
    status: 'active',
    votesFor: 8900000,
    votesAgainst: 2100000,
    quorum: 10000000,
    timeRemaining: '2 days',
    category: 'treasury'
  },
  {
    id: 'prop-003',
    title: 'Governance Token Burn Mechanism',
    description: 'Implement quarterly token burn based on network revenue to reduce total supply.',
    status: 'passed',
    votesFor: 15600000,
    votesAgainst: 3400000,
    quorum: 15000000,
    timeRemaining: 'Ended',
    category: 'governance'
  }
];

// Treasury allocations data removed - Issue #14

export const Governance: FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  // Staking modal state removed - Issue #8

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

  const getProposalProgress = (proposal: Proposal) => {
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
    const quorumProgress = totalVotes > 0 ? (totalVotes / proposal.quorum) * 100 : 0;
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
              <div className={styles.statValue}>{daoStats.totalSupply}</div>
              <div className={styles.statLabel}>Total ROKO Supply</div>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>
              <ChartBarIcon className={styles.icon} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{daoStats.avgVotingPower}</div>
              <div className={styles.statLabel}>Avg Voting Power</div>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>
              <UsersIcon className={styles.icon} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{daoStats.totalHolders}</div>
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
              <h3>Active Proposals</h3>
              <p>Community proposals requiring your vote</p>
            </div>

            <div className={styles.proposalsList}>
              {mockProposals.map((proposal) => {
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

                    {proposal.status === 'active' && (
                      <div className={styles.voteButtons}>
                        <button className={styles.voteFor}>Vote For</button>
                        <button className={styles.voteAgainst}>Vote Against</button>
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