import { FC, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  BanknotesIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import styles from './Governance.module.css';

interface DAOStats {
  totalSupply: string;
  stakedTokens: string;
  stakingApy: string;
  activeValidators: string;
  totalHolders: string;
  treasuryValue: string;
  avgVotingPower: string;
  proposalsPassed: string;
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

interface TreasuryAllocation {
  category: string;
  amount: string;
  percentage: number;
  color: string;
}

const daoStats: DAOStats = {
  totalSupply: '1,000,000,000',
  stakedTokens: '450,000,000',
  stakingApy: '12.5%',
  activeValidators: '1,247',
  totalHolders: '89,432',
  treasuryValue: '$45.2M',
  avgVotingPower: '2.8%',
  proposalsPassed: '127'
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

const treasuryAllocations: TreasuryAllocation[] = [
  { category: 'Development', amount: '$18.1M', percentage: 40, color: '#00d4aa' },
  { category: 'Operations', amount: '$11.3M', percentage: 25, color: '#BAC0CC' },
  { category: 'Community Grants', amount: '$9.0M', percentage: 20, color: '#BCC1D1' },
  { category: 'Marketing', amount: '$4.5M', percentage: 10, color: '#D9DBE3' },
  { category: 'Emergency Fund', amount: '$2.3M', percentage: 5, color: '#666666' }
];

export const Governance: FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [showStakingModal, setShowStakingModal] = useState(false);

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
              <div className={styles.statValue}>{daoStats.stakedTokens}</div>
              <div className={styles.statLabel}>Staked Tokens</div>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>
              <TrophyIcon className={styles.icon} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{daoStats.stakingApy}</div>
              <div className={styles.statLabel}>Staking APY</div>
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

          {/* Staking & Treasury Section */}
          <motion.div className={styles.sidebarSection} variants={itemVariants}>
            {/* Staking Interface */}
            <div className={styles.stakingCard}>
              <div className={styles.cardHeader}>
                <h3>Stake ROKO</h3>
                <p>Earn rewards and voting power</p>
              </div>

              <div className={styles.stakingStats}>
                <div className={styles.stakingStat}>
                  <span className={styles.label}>Your Balance</span>
                  <span className={styles.value}>0 ROKO</span>
                </div>
                <div className={styles.stakingStat}>
                  <span className={styles.label}>Staked Amount</span>
                  <span className={styles.value}>0 pwROKO</span>
                </div>
                <div className={styles.stakingStat}>
                  <span className={styles.label}>Voting Power</span>
                  <span className={styles.value}>0%</span>
                </div>
              </div>

              <button
                className={styles.stakeButton}
                onClick={() => setShowStakingModal(true)}
              >
                Connect Wallet to Stake
              </button>
            </div>

            {/* Treasury Allocation */}
            <div className={styles.treasuryCard}>
              <div className={styles.cardHeader}>
                <h3>Treasury</h3>
                <p>Current allocation: {daoStats.treasuryValue}</p>
              </div>

              <div className={styles.treasuryChart}>
                {treasuryAllocations.map((allocation, index) => (
                  <div key={allocation.category} className={styles.allocationItem}>
                    <div className={styles.allocationBar}>
                      <motion.div
                        className={styles.allocationFill}
                        style={{ backgroundColor: allocation.color }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${allocation.percentage}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <div className={styles.allocationLabel}>
                      <span className={styles.category}>{allocation.category}</span>
                      <span className={styles.amount}>{allocation.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Validator Stats */}
            <div className={styles.validatorCard}>
              <div className={styles.cardHeader}>
                <h3>Validator Network</h3>
                <p>Decentralized temporal consensus</p>
              </div>

              <div className={styles.validatorStats}>
                <div className={styles.validatorStat}>
                  <ShieldCheckIcon className={styles.validatorIcon} />
                  <div>
                    <div className={styles.statNumber}>{daoStats.activeValidators}</div>
                    <div className={styles.statLabel}>Active Validators</div>
                  </div>
                </div>
                <div className={styles.validatorStat}>
                  <DocumentTextIcon className={styles.validatorIcon} />
                  <div>
                    <div className={styles.statNumber}>{daoStats.proposalsPassed}</div>
                    <div className={styles.statLabel}>Proposals Passed</div>
                  </div>
                </div>
              </div>

              <button className={styles.validatorButton}>
                Become a Validator
              </button>
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
            Stake your ROKO tokens to earn voting power and help guide network development.
          </p>
          <div className={styles.ctaButtons}>
            <motion.button
              className={styles.primaryButton}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Get ROKO Tokens
            </motion.button>
            <motion.button
              className={styles.secondaryButton}
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
        {inView && 'Governance section loaded with DAO statistics and active proposals'}
      </div>
    </section>
  );
};

export default Governance;