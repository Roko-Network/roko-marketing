/**
 * Web3 services index
 *
 * Exports all Web3-related services and utilities
 */

export { EtherscanService, etherscanService, formatTokenAmount, formatNumber } from './etherscan';
export type { TokenHolderStats, EtherscanTokenResponse, TokenStatsError, TokenInfo } from './types';

// Re-export commonly used types and functions
export {
  type TokenHolderStats as TokenStats
} from './types';