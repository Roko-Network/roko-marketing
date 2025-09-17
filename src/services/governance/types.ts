/**
 * Snapshot API Types for ROKO Network Governance
 *
 * These types define the structure of data returned from the Snapshot GraphQL API
 * for the rokonetwork.eth space.
 */

export interface SnapshotSpace {
  id: string;
  name: string;
  about?: string;
  network: string;
  symbol: string;
  strategies: SnapshotStrategy[];
  admins: string[];
  members: string[];
  filters: {
    minScore?: number;
    onlyMembers?: boolean;
  };
  plugins: Record<string, any>;
  voting: {
    delay?: number;
    period?: number;
    type?: string;
    quorum?: number;
  };
}

export interface SnapshotStrategy {
  name: string;
  network?: string;
  params?: Record<string, any>;
}

export interface SnapshotProposal {
  id: string;
  title: string;
  body: string;
  discussion: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: SnapshotProposalState;
  author: string;
  space: {
    id: string;
    name: string;
  };
  strategies: SnapshotStrategy[];
  network: string;
  type: string;
  quorum: number;
  privacy: string;
  validation: {
    name: string;
    params: Record<string, any>;
  };
  votes: number;
  scores: number[];
  scores_by_strategy: number[][];
  scores_total: number;
  scores_updated: number;
  created: number;
  updated: number;
}

export type SnapshotProposalState = 'pending' | 'active' | 'closed';

export interface SnapshotVote {
  id: string;
  voter: string;
  created: number;
  proposal: {
    id: string;
  };
  choice: number | number[] | Record<string, number>;
  metadata: Record<string, any>;
  vp: number;
  vp_by_strategy: number[];
  vp_state: string;
}

export interface SnapshotUser {
  id: string;
  name?: string;
  about?: string;
  avatar?: string;
  created: number;
}

// API Response Types
export interface SnapshotProposalsResponse {
  proposals: SnapshotProposal[];
}

export interface SnapshotProposalResponse {
  proposal: SnapshotProposal | null;
}

export interface SnapshotVotesResponse {
  votes: SnapshotVote[];
}

export interface SnapshotSpaceResponse {
  space: SnapshotSpace | null;
}

// GraphQL Query Variables
export interface ProposalsQueryVariables {
  space: string;
  first?: number;
  skip?: number;
  where?: {
    space?: string;
    state?: SnapshotProposalState;
    author?: string;
    created_gte?: number;
    created_lte?: number;
    start_gte?: number;
    start_lte?: number;
    end_gte?: number;
    end_lte?: number;
    title_contains?: string;
  };
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface VotesQueryVariables {
  proposal: string;
  first?: number;
  skip?: number;
  where?: {
    proposal?: string;
    voter?: string;
    created_gte?: number;
    created_lte?: number;
  };
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Transformed Types for UI
export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'failed' | 'pending';
  votesFor: number;
  votesAgainst: number;
  abstain?: number;
  quorum: number;
  timeRemaining: string;
  category: 'treasury' | 'governance' | 'technical' | 'community' | 'other';
  choices: string[];
  scores: number[];
  totalVotes: number;
  startTime: Date;
  endTime: Date;
  author: string;
  discussionLink?: string;
  snapshotHeight: string;
}

export interface GovernanceStats {
  totalSupply: string;
  totalHolders: string;
  avgVotingPower: string;
  activeProposals: number;
  totalProposals: number;
  participationRate: string;
}

// API Error Types
export interface SnapshotApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

// Hook Return Types
export interface UseProposalsResult {
  proposals: GovernanceProposal[];
  loading: boolean;
  error: SnapshotApiError | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export interface UseProposalResult {
  proposal: GovernanceProposal | null;
  votes: SnapshotVote[];
  loading: boolean;
  error: SnapshotApiError | null;
  refetch: () => Promise<void>;
}

export interface UseGovernanceStatsResult {
  stats: GovernanceStats | null;
  loading: boolean;
  error: SnapshotApiError | null;
  refetch: () => Promise<any>;
}

// Cache Configuration
export interface CacheConfig {
  staleTime: number;
  cacheTime: number;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
}

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchInterval: 30 * 1000, // 30 seconds for active proposals
  refetchOnWindowFocus: true,
};