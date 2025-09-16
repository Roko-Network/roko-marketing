import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useChainId } from 'wagmi';
import { parseEther, formatEther, type Address } from 'viem';
import { useState, useEffect } from 'react';
import { WEB3_CONFIG } from '../config/constants';
import { isROKOChain } from '../config/chains';

// Types for token balances and staking
export interface TokenBalance {
  formatted: string;
  value: bigint;
  symbol: string;
  decimals: number;
}

export interface StakingInfo {
  staked: bigint;
  rewards: bigint;
  votingPower: bigint;
  delegate: Address | null;
  lockEndTime: number;
}

export interface Proposal {
  id: bigint;
  title: string;
  description: string;
  proposer: Address;
  startTime: number;
  endTime: number;
  forVotes: bigint;
  againstVotes: bigint;
  abstainVotes: bigint;
  state: 'pending' | 'active' | 'succeeded' | 'defeated' | 'executed';
  actions: {
    target: Address;
    value: bigint;
    calldata: string;
  }[];
}

// Hook for ROKO token balance
export const useROKOBalance = (address?: Address) => {
  const chainId = useChainId();

  const { data: balance, isLoading, error, refetch } = useBalance({
    address,
    token: WEB3_CONFIG.contracts.ROKO_TOKEN as Address,
    query: {
      enabled: !!address && isROKOChain(chainId),
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  return {
    balance: balance ? {
      formatted: balance.formatted,
      value: balance.value,
      symbol: balance.symbol,
      decimals: balance.decimals,
    } as TokenBalance : null,
    isLoading,
    error,
    refetch,
  };
};

// Hook for pwROKO token balance
export const usePwROKOBalance = (address?: Address) => {
  const chainId = useChainId();

  const { data: balance, isLoading, error, refetch } = useBalance({
    address,
    token: WEB3_CONFIG.contracts.PW_ROKO_TOKEN as Address,
    query: {
      enabled: !!address && isROKOChain(chainId),
      refetchInterval: 30000,
    },
  });

  return {
    balance: balance ? {
      formatted: balance.formatted,
      value: balance.value,
      symbol: balance.symbol,
      decimals: balance.decimals,
    } as TokenBalance : null,
    isLoading,
    error,
    refetch,
  };
};

// Hook for staking functionality
export const useStaking = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);

  // Read staking information
  const { data: stakedAmount } = useReadContract({
    address: WEB3_CONFIG.contracts.STAKING as Address,
    abi: [], // TODO: Add staking ABI
    functionName: 'getStakedAmount',
    args: [address],
    query: {
      enabled: !!address && isROKOChain(chainId),
    },
  });

  const { data: rewards } = useReadContract({
    address: WEB3_CONFIG.contracts.STAKING as Address,
    abi: [], // TODO: Add staking ABI
    functionName: 'getPendingRewards',
    args: [address],
    query: {
      enabled: !!address && isROKOChain(chainId),
    },
  });

  const { data: votingPower } = useReadContract({
    address: WEB3_CONFIG.contracts.PW_ROKO_TOKEN as Address,
    abi: [], // TODO: Add pwROKO ABI
    functionName: 'getVotingPower',
    args: [address],
    query: {
      enabled: !!address && isROKOChain(chainId),
    },
  });

  // Stake tokens
  const stake = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      const amountWei = parseEther(amount);
      await writeContract({
        address: WEB3_CONFIG.contracts.STAKING as Address,
        abi: [], // TODO: Add staking ABI
        functionName: 'stake',
        args: [amountWei],
      });
    } catch (error) {
      console.error('Staking error:', error);
      throw error;
    }
  };

  // Unstake tokens
  const unstake = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      const amountWei = parseEther(amount);
      await writeContract({
        address: WEB3_CONFIG.contracts.STAKING as Address,
        abi: [], // TODO: Add staking ABI
        functionName: 'unstake',
        args: [amountWei],
      });
    } catch (error) {
      console.error('Unstaking error:', error);
      throw error;
    }
  };

  // Claim rewards
  const claimRewards = async () => {
    if (!address) throw new Error('Wallet not connected');

    try {
      await writeContract({
        address: WEB3_CONFIG.contracts.STAKING as Address,
        abi: [], // TODO: Add staking ABI
        functionName: 'claimRewards',
        args: [],
      });
    } catch (error) {
      console.error('Claim rewards error:', error);
      throw error;
    }
  };

  // Delegate voting power
  const delegate = async (delegatee: Address) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      await writeContract({
        address: WEB3_CONFIG.contracts.PW_ROKO_TOKEN as Address,
        abi: [], // TODO: Add pwROKO ABI
        functionName: 'delegate',
        args: [delegatee],
      });
    } catch (error) {
      console.error('Delegation error:', error);
      throw error;
    }
  };

  return {
    stakingInfo: {
      staked: (stakedAmount as bigint) || 0n,
      rewards: (rewards as bigint) || 0n,
      votingPower: (votingPower as bigint) || 0n,
      delegate: null, // TODO: Read from contract
      lockEndTime: 0, // TODO: Read from contract
    } as StakingInfo,
    stake,
    unstake,
    claimRewards,
    delegate,
    isPending,
    txHash,
  };
};

// Hook for governance proposals
export const useProposals = () => {
  const chainId = useChainId();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Read proposal count
  const { data: proposalCount } = useReadContract({
    address: WEB3_CONFIG.contracts.GOVERNANCE as Address,
    abi: [], // TODO: Add governance ABI
    functionName: 'proposalCount',
    query: {
      enabled: isROKOChain(chainId),
    },
  });

  // Fetch all proposals
  useEffect(() => {
    const fetchProposals = async () => {
      if (!proposalCount || !isROKOChain(chainId)) return;

      setIsLoading(true);
      try {
        const proposalPromises = Array.from(
          { length: Number(proposalCount) },
          (_, i) => {
            // TODO: Implement proposal fetching logic
            // This would typically involve reading from the governance contract
            return Promise.resolve({
              id: BigInt(i + 1),
              title: `Proposal ${i + 1}`,
              description: 'Sample proposal description',
              proposer: '0x0000000000000000000000000000000000000000' as Address,
              startTime: Date.now() / 1000,
              endTime: Date.now() / 1000 + 7 * 24 * 60 * 60,
              forVotes: 0n,
              againstVotes: 0n,
              abstainVotes: 0n,
              state: 'active' as const,
              actions: [],
            });
          }
        );

        const fetchedProposals = await Promise.all(proposalPromises);
        setProposals(fetchedProposals);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, [proposalCount, chainId]);

  return {
    proposals,
    isLoading,
    proposalCount: Number(proposalCount || 0),
  };
};

// Hook for voting on proposals
export const useVoting = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContract, data: txHash, isPending } = useWriteContract();

  // Cast vote on proposal
  const castVote = async (proposalId: bigint, support: 0 | 1 | 2) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isROKOChain(chainId)) throw new Error('Wrong network');

    try {
      await writeContract({
        address: WEB3_CONFIG.contracts.GOVERNANCE as Address,
        abi: [], // TODO: Add governance ABI
        functionName: 'castVote',
        args: [proposalId, support],
      });
    } catch (error) {
      console.error('Voting error:', error);
      throw error;
    }
  };

  // Cast vote with reason
  const castVoteWithReason = async (
    proposalId: bigint,
    support: 0 | 1 | 2,
    reason: string
  ) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isROKOChain(chainId)) throw new Error('Wrong network');

    try {
      await writeContract({
        address: WEB3_CONFIG.contracts.GOVERNANCE as Address,
        abi: [], // TODO: Add governance ABI
        functionName: 'castVoteWithReason',
        args: [proposalId, support, reason],
      });
    } catch (error) {
      console.error('Voting error:', error);
      throw error;
    }
  };

  // Get voting power for address
  const { data: votingPower } = useReadContract({
    address: WEB3_CONFIG.contracts.PW_ROKO_TOKEN as Address,
    abi: [], // TODO: Add pwROKO ABI
    functionName: 'getVotingPower',
    args: [address],
    query: {
      enabled: !!address && isROKOChain(chainId),
    },
  });

  return {
    castVote,
    castVoteWithReason,
    votingPower: (votingPower as bigint) || 0n,
    isPending,
    txHash,
  };
};

// Hook for token prices
export const useTokenPrice = (tokenAddress?: Address) => {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!tokenAddress) return;

      setIsLoading(true);
      setError(null);

      try {
        // TODO: Implement price fetching from DEX or oracle
        // This could integrate with CoinGecko, DEX APIs, or on-chain oracles

        // Mock implementation
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPrice(1.25); // Mock price
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch price');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();

    // Set up price polling
    const interval = setInterval(fetchPrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [tokenAddress]);

  return {
    price,
    isLoading,
    error,
  };
};

// Hook for transaction status
export const useTransactionStatus = (txHash?: `0x${string}`) => {
  const {
    data: receipt,
    isLoading,
    error,
    isSuccess,
    isError
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  return {
    receipt,
    isLoading,
    error,
    isSuccess,
    isError,
    confirmations: receipt?.blockNumber ? 1 : 0, // Simplified
  };
};

// Main Web3 hook that combines all functionality
export const useWeb3 = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const rokoBalance = useROKOBalance(address);
  const pwRokoBalance = usePwROKOBalance(address);
  const staking = useStaking();
  const voting = useVoting();
  const proposals = useProposals();

  return {
    // Account info
    address,
    isConnected,
    chainId,
    isCorrectNetwork: isROKOChain(chainId),

    // Balances
    rokoBalance: rokoBalance.balance,
    pwRokoBalance: pwRokoBalance.balance,

    // Staking
    stakingInfo: staking.stakingInfo,
    stake: staking.stake,
    unstake: staking.unstake,
    claimRewards: staking.claimRewards,
    delegate: staking.delegate,

    // Governance
    proposals: proposals.proposals,
    proposalCount: proposals.proposalCount,
    votingPower: voting.votingPower,
    castVote: voting.castVote,
    castVoteWithReason: voting.castVoteWithReason,

    // Loading states
    isLoading: rokoBalance.isLoading || pwRokoBalance.isLoading || proposals.isLoading,
    isPending: staking.isPending || voting.isPending,
  };
};

export default useWeb3;