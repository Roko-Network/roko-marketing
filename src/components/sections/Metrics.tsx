import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { snapshotService, SnapshotProposal } from '../../services/snapshot';
import Tokenomics from './Tokenomics'; // ⬅️ added
import styles from '../GovernanceProposals/GovernanceProposals.module.css';

export const GovernanceProposals: FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const data = await snapshotService.getAllProposals(6);
        const formatted = data.map(p => snapshotService.formatProposal(p));
        setProposals(formatted);
        setError(null);
      } catch (err) {
        console.error('Error loading proposals:', err);
        setError('Failed to load proposals');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
    // Refresh every 5 minutes
    const interval = setInterval(fetchProposals, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00d4aa';
      case 'closed': return '#BAC0CC';
      case 'pending': return '#f59e0b';
      default: return '#BAC0CC';
    }
  };

  return (
    <section
      ref={ref}
      className={styles.governanceProposals}
      role="region"
      aria-label="ROKO Network governance proposals"
    >
        {/* ⬇️ Insert Tokenomics here, underneath proposals (or empty-state) and before the Snapshot CTA */}
        <Tokenomics />
        <br />
        <br />
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className={styles.title}>
            <span className={styles.gradientText}>Active Governance</span>
          </h2>
          <p className={styles.subtitle}>
            Live proposals from the ROKO DAO. Vote with your pwROKO tokens to shape the network's future.
          </p>
        </motion.div>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.loader} />
            <p>Loading proposals from Snapshot...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <a
              href={`https://snapshot.box/#/rokonetwork.eth`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fallbackLink}
            >
              View on Snapshot
              <ArrowTopRightOnSquareIcon className={styles.linkIcon} />
            </a>
          </div>
        )}

        {!loading && !error && proposals.length > 0 && (
          <motion.div
            className={styles.proposalsGrid}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {proposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                className={styles.proposalCard}
                variants={itemVariants}
              >
                <div className={styles.proposalHeader}>
                  <span
                    className={styles.status}
                    style={{ backgroundColor: getStatusColor(proposal.status) }}
                  >
                    {proposal.status.toUpperCase()}
                  </span>
                  {proposal.status === 'active' && (
                    <div className={styles.timeRemaining}>
                      <ClockIcon className={styles.timeIcon} />
                      {proposal.timeRemaining}
                    </div>
                  )}
                </div>

                <h3 className={styles.proposalTitle}>{proposal.title}</h3>
                <p className={styles.proposalDescription}>{proposal.description}</p>

                {proposal.totalVotes > 0 && (
                  <div className={styles.voteResults}>
                    <div className={styles.voteBar}>
                      <motion.div
                        className={styles.voteProgress}
                        style={{ width: `${proposal.supportPercentage}%` }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${proposal.supportPercentage}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                    <div className={styles.voteStats}>
                      <div className={styles.voteStat}>
                        <CheckCircleIcon className={styles.voteIcon} style={{ color: '#00d4aa' }} />
                        <span>{proposal.supportPercentage.toFixed(1)}% For</span>
                      </div>
                      <div className={styles.voteStat}>
                        <span>{proposal.votes} votes</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.proposalFooter}>
                  <span className={styles.author}>
                    by {proposal.author.slice(0, 6)}...{proposal.author.slice(-4)}
                  </span>
                  <a
                    href={proposal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.voteButton}
                  >
                    {proposal.status === 'active' ? 'Vote Now' : 'View Details'}
                    <ArrowTopRightOnSquareIcon className={styles.buttonIcon} />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && !error && proposals.length === 0 && (
          <div className={styles.noProposals}>
            <p>No proposals available at the moment.</p>
            <a
              href={`https://snapshot.box/#/rokonetwork.eth`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fallbackLink}
            >
              Create a Proposal on Snapshot
              <ArrowTopRightOnSquareIcon className={styles.linkIcon} />
            </a>
          </div>
        )}


        <motion.div
          className={styles.cta}
          variants={itemVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <a
            href={`https://snapshot.box/#/rokonetwork.eth`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewAllButton}
          >
            View All Proposals on Snapshot
            <ArrowTopRightOnSquareIcon className={styles.linkIcon} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GovernanceProposals;
