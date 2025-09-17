/**
 * React Hooks for ROKO Network Governance Data
 *
 * These hooks provide access to Snapshot API data with proper caching,
 * loading states, and error handling using React Query.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchProposals,
  fetchActiveProposals,
  fetchRecentProposals,
  fetchProposal,
  fetchProposalVotes,
  fetchGovernanceStats,
  SnapshotApiError,
} from '../services/governance/snapshot';
import {
  GovernanceProposal,
  GovernanceStats,
  SnapshotVote,
  UseProposalsResult,
  UseProposalResult,
  UseGovernanceStatsResult,
  DEFAULT_CACHE_CONFIG,
  SnapshotProposalState,
} from '../services/governance/types';
import { useState, useCallback } from 'react';

// Query Keys
export const GOVERNANCE_QUERY_KEYS = {
  all: ['governance'] as const,
  proposals: () => [...GOVERNANCE_QUERY_KEYS.all, 'proposals'] as const,
  proposalsList: (filters: Record<string, any>) =>
    [...GOVERNANCE_QUERY_KEYS.proposals(), 'list', filters] as const,
  proposal: (id: string) => [...GOVERNANCE_QUERY_KEYS.proposals(), 'detail', id] as const,
  votes: (proposalId: string) => [...GOVERNANCE_QUERY_KEYS.proposal(proposalId), 'votes'] as const,
  stats: () => [...GOVERNANCE_QUERY_KEYS.all, 'stats'] as const,
  active: () => [...GOVERNANCE_QUERY_KEYS.proposals(), 'active'] as const,
  recent: () => [...GOVERNANCE_QUERY_KEYS.proposals(), 'recent'] as const,
};

/**
 * Hook to fetch all proposals with pagination
 */
export function useProposals(options: {
  first?: number;
  state?: SnapshotProposalState;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  enabled?: boolean;
} = {}): UseProposalsResult {
  const [skip, setSkip] = useState(0);
  const queryClient = useQueryClient();

  const {
    data: allProposals = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: GOVERNANCE_QUERY_KEYS.proposalsList({
      first: options.first || 20,
      skip,
      state: options.state,
      orderBy: options.orderBy || 'created',
      orderDirection: options.orderDirection || 'desc',
    }),
    queryFn: async () => {
      // Fetch all pages up to current skip
      const allPages: GovernanceProposal[] = [];
      const pageSize = options.first || 20;

      for (let currentSkip = 0; currentSkip <= skip; currentSkip += pageSize) {
        const pageData = await fetchProposals({
          first: pageSize,
          skip: currentSkip,
          state: options.state,
          orderBy: options.orderBy || 'created',
          orderDirection: options.orderDirection || 'desc',
        });
        allPages.push(...pageData);
      }

      return allPages;
    },
    staleTime: DEFAULT_CACHE_CONFIG.staleTime,
    gcTime: DEFAULT_CACHE_CONFIG.cacheTime,
    refetchInterval: options.state === 'active' ? 30000 : undefined, // Refresh active proposals every 30s
    refetchOnWindowFocus: DEFAULT_CACHE_CONFIG.refetchOnWindowFocus,
    enabled: options.enabled !== false,
    retry: (failureCount, error) => {
      // Don't retry on client errors
      if (error instanceof SnapshotApiError && error.code === 'GRAPHQL_ERROR') {
        return false;
      }
      return failureCount < 3;
    },
  });

  const loadMore = useCallback(async () => {
    const pageSize = options.first || 20;
    setSkip(prev => prev + pageSize);
  }, [options.first]);

  const hasMore = allProposals.length > 0 && allProposals.length % (options.first || 20) === 0;

  const refetchProposals = useCallback(async () => {
    setSkip(0); // Reset pagination
    await refetch();
  }, [refetch]);

  return {
    proposals: allProposals,
    loading: isLoading,
    error: error as SnapshotApiError | null,
    refetch: refetchProposals,
    hasMore,
    loadMore,
  };
}

/**
 * Hook to fetch active proposals
 */
export function useActiveProposals(enabled: boolean = true) {
  return useQuery({
    queryKey: GOVERNANCE_QUERY_KEYS.active(),
    queryFn: fetchActiveProposals,
    staleTime: 30000, // 30 seconds for active proposals
    gcTime: DEFAULT_CACHE_CONFIG.cacheTime,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    refetchOnWindowFocus: true,
    enabled,
    retry: (failureCount, error) => {
      if (error instanceof SnapshotApiError && error.code === 'GRAPHQL_ERROR') {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch recent proposals
 */
export function useRecentProposals(enabled: boolean = true) {
  return useQuery({
    queryKey: GOVERNANCE_QUERY_KEYS.recent(),
    queryFn: fetchRecentProposals,
    staleTime: DEFAULT_CACHE_CONFIG.staleTime,
    gcTime: DEFAULT_CACHE_CONFIG.cacheTime,
    refetchOnWindowFocus: DEFAULT_CACHE_CONFIG.refetchOnWindowFocus,
    enabled,
    retry: (failureCount, error) => {
      if (error instanceof SnapshotApiError && error.code === 'GRAPHQL_ERROR') {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch a specific proposal with its votes
 */
export function useProposal(id: string, enabled: boolean = true): UseProposalResult {
  const proposalQuery = useQuery({
    queryKey: GOVERNANCE_QUERY_KEYS.proposal(id),
    queryFn: () => fetchProposal(id),
    staleTime: DEFAULT_CACHE_CONFIG.staleTime,
    gcTime: DEFAULT_CACHE_CONFIG.cacheTime,
    enabled: enabled && !!id,
    retry: (failureCount, error) => {
      if (error instanceof SnapshotApiError && error.code === 'GRAPHQL_ERROR') {
        return false;
      }
      return failureCount < 3;
    },
  });

  const votesQuery = useQuery({
    queryKey: GOVERNANCE_QUERY_KEYS.votes(id),
    queryFn: () => fetchProposalVotes(id),
    staleTime: 60000, // 1 minute for votes
    gcTime: DEFAULT_CACHE_CONFIG.cacheTime,
    enabled: enabled && !!id && !!proposalQuery.data,
    retry: (failureCount, error) => {
      if (error instanceof SnapshotApiError && error.code === 'GRAPHQL_ERROR') {
        return false;
      }
      return failureCount < 3;
    },
  });

  const refetch = useCallback(async () => {
    await Promise.all([
      proposalQuery.refetch(),
      votesQuery.refetch(),
    ]);
  }, [proposalQuery.refetch, votesQuery.refetch]);

  return {
    proposal: proposalQuery.data || null,
    votes: votesQuery.data || [],
    loading: proposalQuery.isLoading || votesQuery.isLoading,
    error: (proposalQuery.error || votesQuery.error) as SnapshotApiError | null,
    refetch,
  };
}

/**
 * Hook to fetch governance statistics
 */
export function useGovernanceStats(enabled: boolean = true): UseGovernanceStatsResult {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: GOVERNANCE_QUERY_KEYS.stats(),
    queryFn: fetchGovernanceStats,
    staleTime: 5 * 60000, // 5 minutes
    gcTime: 10 * 60000, // 10 minutes
    refetchOnWindowFocus: false, // Stats don't change that often
    enabled,
    retry: (failureCount, error) => {
      if (error instanceof SnapshotApiError && error.code === 'GRAPHQL_ERROR') {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    stats: data || null,
    loading: isLoading,
    error: error as SnapshotApiError | null,
    refetch: async () => {
      await refetch();
    },
  };
}

/**
 * Hook to prefetch proposal data for better UX
 */
export function usePrefetchProposal() {
  const queryClient = useQueryClient();

  return useCallback((id: string) => {
    queryClient.prefetchQuery({
      queryKey: GOVERNANCE_QUERY_KEYS.proposal(id),
      queryFn: () => fetchProposal(id),
      staleTime: DEFAULT_CACHE_CONFIG.staleTime,
    });
  }, [queryClient]);
}

/**
 * Hook to invalidate and refetch governance data
 */
export function useInvalidateGovernance() {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: GOVERNANCE_QUERY_KEYS.all,
    });
  }, [queryClient]);
}

/**
 * Combined hook for the Governance component
 * Fetches active proposals, recent proposals, and stats
 */
export function useGovernanceData() {
  const activeProposalsQuery = useActiveProposals();
  const recentProposalsQuery = useRecentProposals();
  const statsQuery = useGovernanceStats();

  // Combine active and recent proposals, removing duplicates
  const allProposals = [...(activeProposalsQuery.data || [])];
  const recentProposals = recentProposalsQuery.data || [];

  // Add recent proposals that aren't already in active
  recentProposals.forEach(proposal => {
    if (!allProposals.find(p => p.id === proposal.id)) {
      allProposals.push(proposal);
    }
  });

  // Sort by status (active first) then by start time (newest first)
  const sortedProposals = allProposals.sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (b.status === 'active' && a.status !== 'active') return 1;
    return b.startTime.getTime() - a.startTime.getTime();
  });

  const isLoading = activeProposalsQuery.isLoading ||
                   recentProposalsQuery.isLoading ||
                   statsQuery.loading;

  const error = activeProposalsQuery.error ||
               recentProposalsQuery.error ||
               statsQuery.error;

  const refetch = useCallback(async () => {
    await Promise.all([
      activeProposalsQuery.refetch(),
      recentProposalsQuery.refetch(),
      statsQuery.refetch(),
    ]);
  }, [activeProposalsQuery.refetch, recentProposalsQuery.refetch, statsQuery.refetch]);

  return {
    proposals: sortedProposals,
    stats: statsQuery.stats,
    loading: isLoading,
    error: error as SnapshotApiError | null,
    refetch,
  };
}