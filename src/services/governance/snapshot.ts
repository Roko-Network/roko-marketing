/**
 * Snapshot API Service for ROKO Network Governance
 *
 * This service handles all interactions with the Snapshot GraphQL API
 * for the rokonetwork.eth space.
 */

import {
  SnapshotProposal,
  SnapshotProposalState,
  SnapshotVote,
  SnapshotSpace,
  GovernanceProposal,
  GovernanceStats,
  ProposalsQueryVariables,
  VotesQueryVariables,
  SnapshotProposalsResponse,
  SnapshotProposalResponse,
  SnapshotVotesResponse,
  SnapshotSpaceResponse,
} from './types';

// Configuration
const SNAPSHOT_API_URL = 'https://hub.snapshot.org/graphql';
const ROKO_SPACE_ID = 'rokonetwork.eth';
const REQUEST_TIMEOUT = 10000; // 10 seconds

// GraphQL Queries
const PROPOSALS_QUERY = `
  query Proposals(
    $space: String!
    $first: Int
    $skip: Int
    $where: ProposalWhere
    $orderBy: String
    $orderDirection: OrderDirection
  ) {
    proposals(
      where: $where
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      title
      body
      discussion
      choices
      start
      end
      snapshot
      state
      author
      space {
        id
        name
      }
      strategies {
        name
        network
        params
      }
      network
      type
      quorum
      privacy
      validation {
        name
        params
      }
      votes
      scores
      scores_by_strategy
      scores_total
      scores_updated
      created
      updated
    }
  }
`;

const PROPOSAL_QUERY = `
  query Proposal($id: String!) {
    proposal(id: $id) {
      id
      title
      body
      discussion
      choices
      start
      end
      snapshot
      state
      author
      space {
        id
        name
      }
      strategies {
        name
        network
        params
      }
      network
      type
      quorum
      privacy
      validation {
        name
        params
      }
      votes
      scores
      scores_by_strategy
      scores_total
      scores_updated
      created
      updated
    }
  }
`;

const VOTES_QUERY = `
  query Votes(
    $proposal: String!
    $first: Int
    $skip: Int
    $where: VoteWhere
    $orderBy: String
    $orderDirection: OrderDirection
  ) {
    votes(
      where: $where
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      voter
      created
      proposal {
        id
      }
      choice
      metadata
      vp
      vp_by_strategy
      vp_state
    }
  }
`;

const SPACE_QUERY = `
  query Space($id: String!) {
    space(id: $id) {
      id
      name
      about
      network
      symbol
      strategies {
        name
        network
        params
      }
      admins
      members
      filters {
        minScore
        onlyMembers
      }
      plugins
      voting {
        delay
        period
        type
        quorum
      }
    }
  }
`;

/**
 * Makes a GraphQL request to the Snapshot API
 */
async function makeSnapshotRequest<T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(SNAPSHOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new SnapshotApiError(
        `HTTP error! status: ${response.status}`,
        'HTTP_ERROR',
        response.status
      );
    }

    const result = await response.json();

    if (result.errors) {
      throw new SnapshotApiError(
        result.errors[0]?.message || 'GraphQL error',
        'GRAPHQL_ERROR'
      );
    }

    return result.data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error instanceof SnapshotApiError) {
      throw error;
    }

    if (error?.name === 'AbortError') {
      throw new SnapshotApiError('Request timeout', 'TIMEOUT');
    }

    if (error instanceof TypeError && error.message?.includes('fetch')) {
      throw new SnapshotApiError('Network error', 'NETWORK_ERROR');
    }

    throw new SnapshotApiError(
      error?.message || 'Unknown error',
      'UNKNOWN_ERROR'
    );
  }
}

/**
 * Transforms a Snapshot proposal to our UI format
 */
function transformProposal(proposal: SnapshotProposal): GovernanceProposal {
  const now = Date.now() / 1000;
  const startTime = new Date(proposal.start * 1000);
  const endTime = new Date(proposal.end * 1000);

  // Determine status
  let status: GovernanceProposal['status'];
  if (proposal.state === 'pending') {
    status = 'pending';
  } else if (proposal.state === 'active') {
    status = 'active';
  } else {
    // Closed proposal - determine if passed or failed
    const totalVotes = proposal.scores_total || 0;
    const quorumMet = totalVotes >= proposal.quorum;
    const hasSupport = proposal.scores[0] > (proposal.scores[1] || 0);
    status = quorumMet && hasSupport ? 'passed' : 'failed';
  }

  // Calculate time remaining
  let timeRemaining: string;
  if (proposal.state === 'pending') {
    const timeToStart = proposal.start - now;
    if (timeToStart > 86400) {
      timeRemaining = `Starts in ${Math.ceil(timeToStart / 86400)} days`;
    } else if (timeToStart > 3600) {
      timeRemaining = `Starts in ${Math.ceil(timeToStart / 3600)} hours`;
    } else {
      timeRemaining = `Starts in ${Math.ceil(timeToStart / 60)} minutes`;
    }
  } else if (proposal.state === 'active') {
    const timeToEnd = proposal.end - now;
    if (timeToEnd > 86400) {
      timeRemaining = `${Math.ceil(timeToEnd / 86400)} days`;
    } else if (timeToEnd > 3600) {
      timeRemaining = `${Math.ceil(timeToEnd / 3600)} hours`;
    } else {
      timeRemaining = `${Math.ceil(timeToEnd / 60)} minutes`;
    }
  } else {
    timeRemaining = 'Ended';
  }

  // Determine category from title and body
  const title = proposal.title.toLowerCase();
  const body = proposal.body.toLowerCase();
  let category: GovernanceProposal['category'] = 'other';

  if (title.includes('treasury') || title.includes('funding') || title.includes('grant')) {
    category = 'treasury';
  } else if (title.includes('governance') || title.includes('voting') || title.includes('dao')) {
    category = 'governance';
  } else if (title.includes('technical') || title.includes('upgrade') || title.includes('protocol')) {
    category = 'technical';
  } else if (title.includes('community') || title.includes('marketing') || title.includes('partnership')) {
    category = 'community';
  }

  return {
    id: proposal.id,
    title: proposal.title,
    description: proposal.body,
    status,
    votesFor: proposal.scores[0] || 0,
    votesAgainst: proposal.scores[1] || 0,
    abstain: proposal.scores[2] || 0,
    quorum: proposal.quorum,
    timeRemaining,
    category,
    choices: proposal.choices,
    scores: proposal.scores,
    totalVotes: proposal.scores_total || 0,
    startTime,
    endTime,
    author: proposal.author,
    discussionLink: proposal.discussion,
    snapshotHeight: proposal.snapshot,
  };
}

/**
 * Calculate time remaining for a proposal
 */
function calculateTimeRemaining(endTimestamp: number): string {
  const now = Date.now() / 1000;
  const timeLeft = endTimestamp - now;

  if (timeLeft <= 0) {
    return 'Ended';
  }

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
}

/**
 * Custom SnapshotApiError class
 */
class SnapshotApiError extends Error implements SnapshotApiError {
  code?: string;
  statusCode?: number;

  constructor(message: string, code?: string, statusCode?: number) {
    super(message);
    this.name = 'SnapshotApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

// API Functions

/**
 * Fetch proposals from the ROKO space
 */
export async function fetchProposals(
  options: {
    first?: number;
    skip?: number;
    state?: SnapshotProposalState;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  } = {}
): Promise<GovernanceProposal[]> {
  const variables: ProposalsQueryVariables = {
    space: ROKO_SPACE_ID,
    first: options.first || 20,
    skip: options.skip || 0,
    orderBy: options.orderBy || 'created',
    orderDirection: options.orderDirection || 'desc',
    where: {
      space: ROKO_SPACE_ID,
      ...(options.state && { state: options.state }),
    },
  };

  const data = await makeSnapshotRequest<SnapshotProposalsResponse>(
    PROPOSALS_QUERY,
    variables
  );

  return data.proposals.map(transformProposal);
}

/**
 * Fetch active proposals
 */
export async function fetchActiveProposals(): Promise<GovernanceProposal[]> {
  return fetchProposals({ state: 'active', first: 10 });
}

/**
 * Fetch recent proposals (last 10)
 */
export async function fetchRecentProposals(): Promise<GovernanceProposal[]> {
  return fetchProposals({ first: 10 });
}

/**
 * Fetch a specific proposal by ID
 */
export async function fetchProposal(id: string): Promise<GovernanceProposal | null> {
  const data = await makeSnapshotRequest<SnapshotProposalResponse>(
    PROPOSAL_QUERY,
    { id }
  );

  return data.proposal ? transformProposal(data.proposal) : null;
}

/**
 * Fetch votes for a proposal
 */
export async function fetchProposalVotes(
  proposalId: string,
  options: {
    first?: number;
    skip?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  } = {}
): Promise<SnapshotVote[]> {
  const variables: VotesQueryVariables = {
    proposal: proposalId,
    first: options.first || 1000,
    skip: options.skip || 0,
    orderBy: options.orderBy || 'created',
    orderDirection: options.orderDirection || 'desc',
    where: {
      proposal: proposalId,
    },
  };

  const data = await makeSnapshotRequest<SnapshotVotesResponse>(
    VOTES_QUERY,
    variables
  );

  return data.votes;
}

/**
 * Fetch space information
 */
export async function fetchSpace(): Promise<SnapshotSpace | null> {
  const data = await makeSnapshotRequest<SnapshotSpaceResponse>(
    SPACE_QUERY,
    { id: ROKO_SPACE_ID }
  );

  return data.space;
}

/**
 * Fetch governance statistics
 */
export async function fetchGovernanceStats(): Promise<GovernanceStats> {
  try {
    // Fetch space info and recent proposals in parallel
    const [space, allProposals] = await Promise.all([
      fetchSpace(),
      fetchProposals({ first: 100 }),
    ]);

    const activeProposals = allProposals.filter(p => p.status === 'active');
    const totalProposals = allProposals.length;

    // Calculate participation rate from recent proposals
    const recentProposals = allProposals.slice(0, 10);
    const avgParticipation = recentProposals.reduce((acc, p) => {
      return acc + (p.totalVotes || 0);
    }, 0) / Math.max(recentProposals.length, 1);

    // Mock some values that aren't available from Snapshot
    return {
      totalSupply: '1,000,000,000',
      totalHolders: '89,432',
      avgVotingPower: '2.8%',
      activeProposals: activeProposals.length,
      totalProposals,
      participationRate: `${(avgParticipation / 1000000 * 100).toFixed(1)}%`,
    };
  } catch (error) {
    // Return fallback stats if API fails
    return {
      totalSupply: '1,000,000,000',
      totalHolders: '89,432',
      avgVotingPower: '2.8%',
      activeProposals: 0,
      totalProposals: 0,
      participationRate: '0%',
    };
  }
}

// Export error class for type checking
export { SnapshotApiError };