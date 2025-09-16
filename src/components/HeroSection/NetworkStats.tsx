import React, { memo } from 'react';
import { motion } from 'framer-motion';
import styles from './NetworkStats.module.css';

interface NetworkStatsData {
  totalTransactions: number;
  averageLatency: number;
  clockSyncAccuracy: number;
  activeNodes: number;
  networkUptime: number;
}

interface NetworkStatsProps {
  stats: NetworkStatsData | null;
  loading: boolean;
  error: string | null;
}

const StatItem: React.FC<{
  label: string;
  value: string;
  unit?: string;
  delay?: number;
}> = ({ label, value, unit, delay = 0 }) => (
  <motion.div
    className={styles.statItem}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
  >
    <div className={styles.statValue}>
      {value}
      {unit && <span className={styles.statUnit}>{unit}</span>}
    </div>
    <div className={styles.statLabel}>{label}</div>
  </motion.div>
);

export const NetworkStats: React.FC<NetworkStatsProps> = memo(({ stats, loading, error }) => {
  if (loading) {
    return (
      <div className={styles.container} aria-label="Loading network statistics">
        <div className={styles.loadingState}>
          <div className={styles.spinner} aria-hidden="true" />
          <span>Loading network stats...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container} role="alert" aria-label="Error loading network statistics">
        <div className={styles.errorState}>
          <span className={styles.errorIcon}>⚠</span>
          <span>Unable to load network statistics</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatNumber = (num: number): string => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const formatLatency = (latency: number): string => {
    if (latency < 1) return `${(latency * 1000).toFixed(0)}μs`;
    return `${latency.toFixed(2)}ms`;
  };

  const formatAccuracy = (accuracy: number): string => {
    return `${(accuracy * 1000).toFixed(0)}ns`;
  };

  const formatUptime = (uptime: number): string => {
    return `${(uptime * 100).toFixed(2)}%`;
  };

  return (
    <div className={styles.container} role="region" aria-label="Network statistics">
      <div className={styles.statsGrid}>
        <StatItem
          label="Target Transactions"
          value={formatNumber(stats.totalTransactions)}
          delay={0.1}
        />
        <StatItem
          label="Average Latency"
          value={formatLatency(stats.averageLatency)}
          delay={0.2}
        />
        <StatItem
          label="Clock Sync Accuracy"
          value={formatAccuracy(stats.clockSyncAccuracy)}
          delay={0.3}
        />
        <StatItem
          label="Target Nodes"
          value={formatNumber(stats.activeNodes)}
          delay={0.4}
        />
        <StatItem
          label="Target Uptime"
          value={formatUptime(stats.networkUptime)}
          delay={0.5}
        />
      </div>
    </div>
  );
});

NetworkStats.displayName = 'NetworkStats';