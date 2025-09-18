/**
 * Dynamic Token Statistics Component
 *
 * Displays real-time ROKO token statistics fetched from the official Roko price API
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useRokoPriceData, useRokoTokenInfo } from '../../hooks/useRokoPriceData';
import { formatNumber } from '../../utils/formatters';
import styles from './TokenStats.module.css';

interface TokenStatsProps {
  showHeader?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
}

const StatItem: React.FC<{
  label: string;
  value: string;
  unit?: string;
  delay?: number;
  isLoading?: boolean;
}> = ({ label, value, unit, delay = 0, isLoading = false }) => (
  <motion.div
    className={styles.statItem}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
  >
    <div className={styles.statValue}>
      {isLoading ? (
        <div className={styles.loadingSkeleton} aria-label="Loading..." />
      ) : (
        <>
          {value}
          {unit && <span className={styles.statUnit}>{unit}</span>}
        </>
      )}
    </div>
    <div className={styles.statLabel}>{label}</div>
  </motion.div>
);

const ErrorDisplay: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className={styles.errorContainer} role="alert">
    <div className={styles.errorIcon}>⚠</div>
    <div className={styles.errorContent}>
      <p className={styles.errorMessage}>Unable to load token statistics</p>
      <button
        className={styles.retryButton}
        onClick={onRetry}
        aria-label="Retry loading token statistics"
      >
        Retry
      </button>
    </div>
  </div>
);

export const TokenStats: React.FC<TokenStatsProps> = memo(({
  showHeader = true,
  className = '',
  variant = 'default'
}) => {
  const { data: stats, isLoading, error, refetch } = useRokoPriceData({
    refetchInterval: 60000 // Refresh every minute
  });
  const { data: tokenInfo } = useRokoTokenInfo();

  if (error && !stats) {
    return (
      <div className={`${styles.container} ${styles[variant]} ${className}`}>
        <ErrorDisplay error={error} onRetry={refetch} />
      </div>
    );
  }

  const formatSupply = (supply: string): string => {
    if (!supply || supply === '0') return '0';

    try {
      const num = parseFloat(supply);
      if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
      if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
      if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
      return formatNumber(num);
    } catch {
      return '0';
    }
  };

  const containerClasses = `${styles.container} ${styles[variant]} ${className}`;

  return (
    <div className={containerClasses} role="region" aria-label="ROKO token statistics">
      {showHeader && (
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className={styles.title}>ROKO Token Stats</h3>
          {tokenInfo && (
            <div className={styles.tokenInfo}>
              <span className={styles.tokenSymbol}>{tokenInfo.symbol}</span>
              <span className={styles.tokenAddress} title={tokenInfo.address}>
                {`${tokenInfo.address.slice(0, 6)}...${tokenInfo.address.slice(-4)}`}
              </span>
            </div>
          )}
        </motion.div>
      )}

      <div className={styles.statsGrid}>
        <StatItem
          label="Price USD"
          value={stats?.price || '$0.00'}
          delay={0.1}
          isLoading={isLoading}
        />

        <StatItem
          label="Market Cap"
          value={stats?.marketCap || '$0'}
          delay={0.2}
          isLoading={isLoading}
        />

        <StatItem
          label="Total Supply"
          value={stats ? formatSupply(stats.totalSupply) : '0'}
          unit="ROKO"
          delay={0.3}
          isLoading={isLoading}
        />

        <StatItem
          label="Circulating Supply"
          value={stats ? formatSupply(stats.circulatingSupply) : '0'}
          unit="ROKO"
          delay={0.4}
          isLoading={isLoading}
        />

        <StatItem
          label="Total TVL"
          value={stats?.tvl || '$0'}
          delay={0.5}
          isLoading={isLoading}
        />
      </div>

      {/* Status indicator */}
      <div className={styles.statusBar}>
        <div className={`${styles.statusDot} ${isLoading ? styles.loading : styles.connected}`} />
        <span className={styles.statusText}>
          {isLoading ? 'Updating...' : 'Live data from Roko API'}
        </span>
        {stats && stats.lastUpdated && (
          <span className={styles.lastUpdate}>
            Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
});

TokenStats.displayName = 'TokenStats';

export default TokenStats;