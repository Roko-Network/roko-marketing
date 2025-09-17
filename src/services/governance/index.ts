/**
 * Governance Services Index
 *
 * Exports all governance-related services and types
 */

// Services
export * from './snapshot';

// Types
export * from './types';

// Re-export specific commonly used items for convenience
export {
  fetchActiveProposals,
  fetchRecentProposals,
  fetchProposal,
  fetchGovernanceStats,
  SnapshotApiError,
} from './snapshot';

export type {
  GovernanceProposal,
  GovernanceStats,
  SnapshotProposal,
  SnapshotVote,
  UseProposalsResult,
  UseProposalResult,
  UseGovernanceStatsResult,
} from './types';