// Snapshot API integration for governance proposals
// https://docs.snapshot.box/tools/api

const SNAPSHOT_HUB_URL = 'https://hub.snapshot.org/graphql';
const SNAPSHOT_SPACE = 'rokonetwork.eth';

export interface SnapshotProposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: 'pending' | 'active' | 'closed';
  author: string;
  created: number;
  scores: number[];
  scores_total: number;
  scores_state: string;
  votes: number;
  space: {
    id: string;
    name: string;
  };
}

export interface SnapshotSpace {
  id: string;
  name: string;
  about: string;
  network: string;
  symbol: string;
  members: string[];
  admins: string[];
  avatar: string;
  twitter: string;
  website: string;
  github: string;
  coingecko: string;
  followersCount: number;
  proposalsCount: number;
}

const PROPOSALS_QUERY = `
  query Proposals($space: String!, $state: String!, $first: Int!, $skip: Int!) {
    proposals(
      first: $first,
      skip: $skip,
      where: {
        space_in: [$space],
        state: $state
      },
      orderBy: "created",
      orderDirection: desc
    ) {
      id
      title
      body
      choices
      start
      end
      snapshot
      state
      author
      created
      scores
      scores_total
      scores_state
      votes
      space {
        id
        name
      }
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
      members
      admins
      avatar
      twitter
      website
      github
      coingecko
      followersCount
      proposalsCount
    }
  }
`;

class SnapshotService {
  private async fetchGraphQL<T>(query: string, variables: any): Promise<T> {
    try {
      const response = await fetch(SNAPSHOT_HUB_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`Snapshot API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching from Snapshot:', error);
      throw error;
    }
  }

  async getActiveProposals(limit: number = 10): Promise<SnapshotProposal[]> {
    try {
      const data = await this.fetchGraphQL<{ proposals: SnapshotProposal[] }>(
        PROPOSALS_QUERY,
        {
          space: SNAPSHOT_SPACE,
          state: 'active',
          first: limit,
          skip: 0,
        }
      );
      return data.proposals;
    } catch (error) {
      console.error('Error fetching active proposals:', error);
      return [];
    }
  }

  async getClosedProposals(limit: number = 10): Promise<SnapshotProposal[]> {
    try {
      const data = await this.fetchGraphQL<{ proposals: SnapshotProposal[] }>(
        PROPOSALS_QUERY,
        {
          space: SNAPSHOT_SPACE,
          state: 'closed',
          first: limit,
          skip: 0,
        }
      );
      return data.proposals;
    } catch (error) {
      console.error('Error fetching closed proposals:', error);
      return [];
    }
  }

  async getAllProposals(limit: number = 20): Promise<SnapshotProposal[]> {
    try {
      const [active, closed] = await Promise.all([
        this.getActiveProposals(limit / 2),
        this.getClosedProposals(limit / 2),
      ]);
      return [...active, ...closed];
    } catch (error) {
      console.error('Error fetching all proposals:', error);
      return [];
    }
  }

  async getSpace(): Promise<SnapshotSpace | null> {
    try {
      const data = await this.fetchGraphQL<{ space: SnapshotSpace }>(
        SPACE_QUERY,
        { id: SNAPSHOT_SPACE }
      );
      return data.space;
    } catch (error) {
      console.error('Error fetching space info:', error);
      return null;
    }
  }

  // Helper method to format proposal for display
  formatProposal(proposal: SnapshotProposal) {
    const now = Date.now() / 1000;
    const isActive = proposal.state === 'active' && now >= proposal.start && now <= proposal.end;
    const timeRemaining = isActive ? this.getTimeRemaining(proposal.end) : 'Ended';

    // Calculate support percentage if there are scores
    const supportPercentage = proposal.scores_total > 0
      ? ((proposal.scores[0] || 0) / proposal.scores_total) * 100
      : 0;

    return {
      id: proposal.id,
      title: proposal.title,
      description: proposal.body.slice(0, 200) + '...',
      status: isActive ? 'active' : proposal.state,
      votesFor: proposal.scores[0] || 0,
      votesAgainst: proposal.scores[1] || 0,
      totalVotes: proposal.scores_total,
      supportPercentage,
      timeRemaining,
      author: proposal.author,
      created: new Date(proposal.created * 1000),
      votes: proposal.votes,
      choices: proposal.choices,
      url: `https://snapshot.box/#/${SNAPSHOT_SPACE}/proposal/${proposal.id}`,
    };
  }

  private getTimeRemaining(endTimestamp: number): string {
    const now = Date.now() / 1000;
    const remaining = endTimestamp - now;

    if (remaining <= 0) return 'Ended';

    const days = Math.floor(remaining / (24 * 60 * 60));
    const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;

    const minutes = Math.floor((remaining % (60 * 60)) / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
}

export const snapshotService = new SnapshotService();