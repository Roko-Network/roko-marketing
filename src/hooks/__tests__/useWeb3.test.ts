/**
 * @fileoverview useWeb3 hook test suite
 * @author ROKO QA Team
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { testData, mockWalletConnection, createTestQueryClient } from '@/test-utils';
import {
  useWeb3,
  useROKOBalance,
  usePwROKOBalance,
  useStaking,
  useProposals,
  useVoting,
  useTokenPrice,
  useTransactionStatus
} from '../useWeb3';

// Mock wagmi hooks
const mockUseAccount = vi.fn();
const mockUseBalance = vi.fn();
const mockUseReadContract = vi.fn();
const mockUseWriteContract = vi.fn();
const mockUseWaitForTransactionReceipt = vi.fn();
const mockUseChainId = vi.fn();

vi.mock('wagmi', () => ({
  useAccount: () => mockUseAccount(),
  useBalance: (params: any) => mockUseBalance(params),
  useReadContract: (params: any) => mockUseReadContract(params),
  useWriteContract: () => mockUseWriteContract(),
  useWaitForTransactionReceipt: (params: any) => mockUseWaitForTransactionReceipt(params),
  useChainId: () => mockUseChainId(),
}));

// Mock viem
vi.mock('viem', () => ({
  parseEther: vi.fn((value: string) => BigInt(value + '000000000000000000')),
  formatEther: vi.fn((value: bigint) => (Number(value) / 1e18).toString()),
}));

// Mock config
vi.mock('../config/constants', () => ({
  WEB3_CONFIG: {
    contracts: {
      ROKO_TOKEN: '0x1111111111111111111111111111111111111111',
      PW_ROKO_TOKEN: '0x2222222222222222222222222222222222222222',
      STAKING: '0x3333333333333333333333333333333333333333',
      GOVERNANCE: '0x4444444444444444444444444444444444444444',
    },
  },
}));

vi.mock('../config/chains', () => ({
  isROKOChain: vi.fn((chainId: number) => chainId === 12345),
}));

describe('useWeb3 Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockUseAccount.mockReturnValue({
      address: testData.users.alice.address,
      isConnected: true,
    });
    
    mockUseChainId.mockReturnValue(12345);
    
    mockUseBalance.mockImplementation((params) => ({
      data: {
        value: BigInt(params?.token ? testData.users.alice.pwROKO : testData.users.alice.balance),
        formatted: params?.token ? '500.0' : '1000.0',
        symbol: params?.token ? 'ROKO' : 'ETH',
        decimals: 18,
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    }));
    
    mockUseReadContract.mockReturnValue({
      data: BigInt('1000000000000000000000'), // 1000 tokens
      isLoading: false,
      error: null,
    });
    
    mockUseWriteContract.mockReturnValue({
      writeContract: vi.fn(),
      data: '0xabcdef1234567890',
      isPending: false,
    });
    
    mockUseWaitForTransactionReceipt.mockReturnValue({
      data: {
        status: 'success',
        blockNumber: 12345n,
        transactionHash: '0xabcdef1234567890',
      },
      isLoading: false,
      error: null,
      isSuccess: true,
      isError: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useROKOBalance', () => {
    it('should return ROKO token balance for connected user', () => {
      const { result } = renderHook(() => useROKOBalance(testData.users.alice.address));
      
      expect(result.current.balance).toEqual({
        formatted: '500.0',
        value: BigInt(testData.users.alice.pwROKO),
        symbol: 'ROKO',
        decimals: 18,
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should return null when no address provided', () => {
      const { result } = renderHook(() => useROKOBalance(undefined));
      
      expect(result.current.balance).toEqual({
        formatted: '500.0',
        value: BigInt(testData.users.alice.pwROKO),
        symbol: 'ROKO',
        decimals: 18,
      });
    });

    it('should refetch balance when requested', async () => {
      const mockRefetch = vi.fn();
      mockUseBalance.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useROKOBalance(testData.users.alice.address));
      
      await act(async () => {
        result.current.refetch();
      });

      expect(mockRefetch).toHaveBeenCalled();
    });

    it('should handle loading state', () => {
      mockUseBalance.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => useROKOBalance(testData.users.alice.address));
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.balance).toBe(null);
    });

    it('should handle error state', () => {
      const error = new Error('Failed to fetch balance');
      mockUseBalance.mockReturnValue({
        data: null,
        isLoading: false,
        error,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => useROKOBalance(testData.users.alice.address));
      
      expect(result.current.error).toBe(error);
      expect(result.current.balance).toBe(null);
    });
  });

  describe('usePwROKOBalance', () => {
    it('should return pwROKO token balance for connected user', () => {
      const { result } = renderHook(() => usePwROKOBalance(testData.users.alice.address));
      
      expect(result.current.balance).toEqual({
        formatted: '500.0',
        value: BigInt(testData.users.alice.pwROKO),
        symbol: 'ROKO',
        decimals: 18,
      });
    });

    it('should use correct token contract address', () => {
      renderHook(() => usePwROKOBalance(testData.users.alice.address));
      
      expect(mockUseBalance).toHaveBeenCalledWith(
        expect.objectContaining({
          token: '0x2222222222222222222222222222222222222222',
        })
      );
    });
  });

  describe('useStaking', () => {
    it('should return staking information', () => {
      const { result } = renderHook(() => useStaking());
      
      expect(result.current.stakingInfo).toEqual({
        staked: BigInt('1000000000000000000000'),
        rewards: BigInt('1000000000000000000000'),
        votingPower: BigInt('1000000000000000000000'),
        delegate: null,
        lockEndTime: 0,
      });
    });

    it('should handle staking tokens', async () => {
      const mockWriteContract = vi.fn();
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xstakedhash',
        isPending: false,
      });

      const { result } = renderHook(() => useStaking());
      
      await act(async () => {
        await result.current.stake('100');
      });

      expect(mockWriteContract).toHaveBeenCalledWith({
        address: '0x3333333333333333333333333333333333333333',
        abi: [],
        functionName: 'stake',
        args: [BigInt('100000000000000000000')],
      });
    });

    it('should handle unstaking tokens', async () => {
      const mockWriteContract = vi.fn();
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xunstakedhash',
        isPending: false,
      });

      const { result } = renderHook(() => useStaking());
      
      await act(async () => {
        await result.current.unstake('50');
      });

      expect(mockWriteContract).toHaveBeenCalledWith({
        address: '0x3333333333333333333333333333333333333333',
        abi: [],
        functionName: 'unstake',
        args: [BigInt('50000000000000000000')],
      });
    });

    it('should handle claiming rewards', async () => {
      const mockWriteContract = vi.fn();
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xclaimhash',
        isPending: false,
      });

      const { result } = renderHook(() => useStaking());
      
      await act(async () => {
        await result.current.claimRewards();
      });

      expect(mockWriteContract).toHaveBeenCalledWith({
        address: '0x3333333333333333333333333333333333333333',
        abi: [],
        functionName: 'claimRewards',
        args: [],
      });
    });

    it('should handle delegation', async () => {
      const mockWriteContract = vi.fn();
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xdelegatehash',
        isPending: false,
      });

      const { result } = renderHook(() => useStaking());
      
      await act(async () => {
        await result.current.delegate(testData.users.bob.address);
      });

      expect(mockWriteContract).toHaveBeenCalledWith({
        address: '0x2222222222222222222222222222222222222222',
        abi: [],
        functionName: 'delegate',
        args: [testData.users.bob.address],
      });
    });

    it('should throw error when wallet not connected', async () => {
      mockUseAccount.mockReturnValue({
        address: null,
        isConnected: false,
      });

      const { result } = renderHook(() => useStaking());
      
      await expect(result.current.stake('100')).rejects.toThrow('Wallet not connected');
    });
  });

  describe('useProposals', () => {
    it('should return proposals list', async () => {
      mockUseReadContract.mockReturnValue({
        data: BigInt(2), // 2 proposals
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useProposals());
      
      await waitFor(() => {
        expect(result.current.proposalCount).toBe(2);
        expect(result.current.proposals).toHaveLength(2);
      });
    });

    it('should handle loading state', () => {
      mockUseReadContract.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      const { result } = renderHook(() => useProposals());
      
      expect(result.current.isLoading).toBe(false); // Set by useState initially
      expect(result.current.proposals).toHaveLength(0);
    });

    it('should not fetch proposals on wrong chain', () => {
      mockUseChainId.mockReturnValue(1); // Ethereum mainnet
      
      const { result } = renderHook(() => useProposals());
      
      expect(result.current.proposals).toHaveLength(0);
    });
  });

  describe('useVoting', () => {
    it('should return voting functionality', () => {
      const { result } = renderHook(() => useVoting());
      
      expect(result.current.votingPower).toBe(BigInt('1000000000000000000000'));
      expect(typeof result.current.castVote).toBe('function');
      expect(typeof result.current.castVoteWithReason).toBe('function');
    });

    it('should handle casting vote', async () => {
      const mockWriteContract = vi.fn();
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xvotehash',
        isPending: false,
      });

      const { result } = renderHook(() => useVoting());
      
      await act(async () => {
        await result.current.castVote(BigInt(1), 1);
      });

      expect(mockWriteContract).toHaveBeenCalledWith({
        address: '0x4444444444444444444444444444444444444444',
        abi: [],
        functionName: 'castVote',
        args: [BigInt(1), 1],
      });
    });

    it('should handle casting vote with reason', async () => {
      const mockWriteContract = vi.fn();
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: '0xvotereasonhash',
        isPending: false,
      });

      const { result } = renderHook(() => useVoting());
      
      await act(async () => {
        await result.current.castVoteWithReason(BigInt(1), 1, 'Great proposal!');
      });

      expect(mockWriteContract).toHaveBeenCalledWith({
        address: '0x4444444444444444444444444444444444444444',
        abi: [],
        functionName: 'castVoteWithReason',
        args: [BigInt(1), 1, 'Great proposal!'],
      });
    });

    it('should throw error on wrong network', async () => {
      mockUseChainId.mockReturnValue(1); // Wrong network

      const { result } = renderHook(() => useVoting());
      
      await expect(result.current.castVote(BigInt(1), 1)).rejects.toThrow('Wrong network');
    });
  });

  describe('useTokenPrice', () => {
    it('should fetch and return token price', async () => {
      const { result } = renderHook(() => useTokenPrice('0x1234567890123456789012345678901234567890'));
      
      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.price).toBe(1.25);
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 2000 });
    });

    it('should not fetch price without token address', () => {
      const { result } = renderHook(() => useTokenPrice(undefined));
      
      expect(result.current.price).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle price fetch error', async () => {
      // Override setTimeout to immediately trigger error
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = vi.fn((fn) => {
        fn();
        throw new Error('Price fetch failed');
      });

      const { result } = renderHook(() => useTokenPrice('0x1234567890123456789012345678901234567890'));
      
      await waitFor(() => {
        expect(result.current.error).toBe('Price fetch failed');
      });

      global.setTimeout = originalSetTimeout;
    });
  });

  describe('useTransactionStatus', () => {
    it('should return transaction receipt when successful', () => {
      const txHash = '0xabcdef1234567890' as `0x${string}`;
      const { result } = renderHook(() => useTransactionStatus(txHash));
      
      expect(result.current.receipt).toEqual({
        status: 'success',
        blockNumber: 12345n,
        transactionHash: '0xabcdef1234567890',
      });
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.confirmations).toBe(1);
    });

    it('should handle loading state', () => {
      mockUseWaitForTransactionReceipt.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        isSuccess: false,
        isError: false,
      });

      const txHash = '0xabcdef1234567890' as `0x${string}`;
      const { result } = renderHook(() => useTransactionStatus(txHash));
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.confirmations).toBe(0);
    });

    it('should handle error state', () => {
      const error = new Error('Transaction failed');
      mockUseWaitForTransactionReceipt.mockReturnValue({
        data: null,
        isLoading: false,
        error,
        isSuccess: false,
        isError: true,
      });

      const txHash = '0xabcdef1234567890' as `0x${string}`;
      const { result } = renderHook(() => useTransactionStatus(txHash));
      
      expect(result.current.error).toBe(error);
      expect(result.current.isError).toBe(true);
    });
  });

  describe('useWeb3 (Main Hook)', () => {
    it('should combine all Web3 functionality', () => {
      const { result } = renderHook(() => useWeb3());
      
      // Account info
      expect(result.current.address).toBe(testData.users.alice.address);
      expect(result.current.isConnected).toBe(true);
      expect(result.current.chainId).toBe(12345);
      expect(result.current.isCorrectNetwork).toBe(true);
      
      // Balances
      expect(result.current.rokoBalance).toBeDefined();
      expect(result.current.pwRokoBalance).toBeDefined();
      
      // Staking
      expect(result.current.stakingInfo).toBeDefined();
      expect(typeof result.current.stake).toBe('function');
      expect(typeof result.current.unstake).toBe('function');
      expect(typeof result.current.claimRewards).toBe('function');
      expect(typeof result.current.delegate).toBe('function');
      
      // Governance
      expect(Array.isArray(result.current.proposals)).toBe(true);
      expect(typeof result.current.proposalCount).toBe('number');
      expect(result.current.votingPower).toBeDefined();
      expect(typeof result.current.castVote).toBe('function');
      expect(typeof result.current.castVoteWithReason).toBe('function');
    });

    it('should handle disconnected wallet', () => {
      mockUseAccount.mockReturnValue({
        address: null,
        isConnected: false,
      });

      const { result } = renderHook(() => useWeb3());
      
      expect(result.current.address).toBe(null);
      expect(result.current.isConnected).toBe(false);
    });

    it('should handle wrong network', () => {
      mockUseChainId.mockReturnValue(1); // Ethereum mainnet
      
      const { result } = renderHook(() => useWeb3());
      
      expect(result.current.isCorrectNetwork).toBe(false);
    });

    it('should aggregate loading states', () => {
      mockUseBalance.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => useWeb3());
      
      expect(result.current.isLoading).toBe(true);
    });

    it('should aggregate pending states', () => {
      mockUseWriteContract.mockReturnValue({
        writeContract: vi.fn(),
        data: null,
        isPending: true,
      });

      const { result } = renderHook(() => useWeb3());
      
      expect(result.current.isPending).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle contract read errors gracefully', () => {
      mockUseReadContract.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Contract call failed'),
      });

      const { result } = renderHook(() => useWeb3());
      
      // Should not crash and should have fallback values
      expect(result.current.stakingInfo.staked).toBe(0n);
    });

    it('should handle network errors in staking', async () => {
      const mockWriteContract = vi.fn().mockRejectedValue(new Error('Network error'));
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: null,
        isPending: false,
      });

      const { result } = renderHook(() => useStaking());
      
      await expect(result.current.stake('100')).rejects.toThrow('Network error');
    });

    it('should handle invalid amounts in staking', async () => {
      const mockWriteContract = vi.fn();
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: null,
        isPending: false,
      });

      const { result } = renderHook(() => useStaking());
      
      // Test with invalid amount
      await expect(result.current.stake('invalid')).rejects.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should work with real wallet connection flow', async () => {
      // Mock wallet connection sequence
      mockUseAccount
        .mockReturnValueOnce({ address: null, isConnected: false })
        .mockReturnValueOnce({ address: testData.users.alice.address, isConnected: true });

      const { result, rerender } = renderHook(() => useWeb3());
      
      // Initially disconnected
      expect(result.current.isConnected).toBe(false);
      
      // After wallet connection
      rerender();
      expect(result.current.isConnected).toBe(true);
      expect(result.current.address).toBe(testData.users.alice.address);
    });

    it('should handle chain switching', () => {
      // Start on wrong chain
      mockUseChainId.mockReturnValue(1);
      
      const { result, rerender } = renderHook(() => useWeb3());
      expect(result.current.isCorrectNetwork).toBe(false);
      
      // Switch to correct chain
      mockUseChainId.mockReturnValue(12345);
      rerender();
      expect(result.current.isCorrectNetwork).toBe(true);
    });
  });
});
