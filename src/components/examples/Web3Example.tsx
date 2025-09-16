import React, { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { formatEther, parseEther, type Address } from 'viem';
import { ConnectWallet } from '../molecules/ConnectWallet';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useWeb3 } from '../../hooks/useWeb3';
import { contractService } from '../../services/contracts';
import { gaslessVotingService, isGaslessAvailable } from '../../services/gasless';
import { isROKOChain } from '../../config/chains';
import { COLORS } from '../../config/constants';
import type { Proposal, VoteType } from '../../types/contracts';

interface Web3ExampleProps {
  className?: string;
}

export const Web3Example: React.FC<Web3ExampleProps> = ({ className = '' }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const web3 = useWeb3();

  // Component state
  const [activeTab, setActiveTab] = useState<'balance' | 'staking' | 'governance'>('balance');
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<bigint | null>(null);
  const [voteType, setVoteType] = useState<VoteType>(1); // For
  const [voteReason, setVoteReason] = useState('');
  const [isGaslessEnabled, setIsGaslessEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Check gasless availability on mount
  useEffect(() => {
    const checkGasless = async () => {
      const available = await isGaslessAvailable();
      setIsGaslessEnabled(available);
    };
    checkGasless();
  }, []);

  // Clear errors when switching tabs
  useEffect(() => {
    setError('');
    setTxHash('');
  }, [activeTab]);

  // Handle staking
  const handleStake = async () => {
    if (!address || !stakeAmount) return;

    setIsLoading(true);
    setError('');
    setTxHash('');

    try {
      const amount = parseEther(stakeAmount);

      // First approve ROKO tokens
      const approveHash = await contractService.approveROKO(
        contractService.CONTRACTS.STAKING,
        amount
      );

      console.log('Approval transaction:', approveHash);

      // Wait for approval
      await contractService.waitForTransaction(approveHash);

      // Then stake
      const stakeHash = await contractService.stake(amount);
      setTxHash(stakeHash);

      console.log('Stake transaction:', stakeHash);

      // Reset form
      setStakeAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Staking failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle unstaking
  const handleUnstake = async () => {
    if (!address || !unstakeAmount) return;

    setIsLoading(true);
    setError('');
    setTxHash('');

    try {
      const amount = parseEther(unstakeAmount);
      const hash = await contractService.unstake(amount);
      setTxHash(hash);

      console.log('Unstake transaction:', hash);

      // Reset form
      setUnstakeAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unstaking failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle claiming rewards
  const handleClaimRewards = async () => {
    if (!address) return;

    setIsLoading(true);
    setError('');
    setTxHash('');

    try {
      const hash = await contractService.claimStakingRewards();
      setTxHash(hash);

      console.log('Claim rewards transaction:', hash);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Claiming rewards failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voting
  const handleVote = async () => {
    if (!address || selectedProposal === null) return;

    setIsLoading(true);
    setError('');
    setTxHash('');

    try {
      let hash: string;

      if (isGaslessEnabled) {
        // Use gasless voting
        const { userOpHash } = await gaslessVotingService.createGaslessVote(
          address,
          selectedProposal,
          voteType,
          voteReason || undefined
        );
        hash = userOpHash;
        console.log('Gasless vote user operation:', userOpHash);
      } else {
        // Use regular voting
        if (voteReason) {
          hash = await contractService.castVoteWithReason(
            selectedProposal,
            voteType,
            voteReason
          );
        } else {
          hash = await contractService.castVote(selectedProposal, voteType);
        }
        console.log('Vote transaction:', hash);
      }

      setTxHash(hash);

      // Reset form
      setSelectedProposal(null);
      setVoteReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voting failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delegation
  const handleDelegate = async (delegatee: Address) => {
    if (!address) return;

    setIsLoading(true);
    setError('');
    setTxHash('');

    try {
      const hash = await contractService.delegateVotes(delegatee);
      setTxHash(hash);

      console.log('Delegation transaction:', hash);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delegation failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Render network warning
  const renderNetworkWarning = () => {
    if (!isConnected || isROKOChain(chainId)) return null;

    return (
      <Card className="mb-6 p-4 bg-red-900/20 border-red-500">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-red-300">
            Please switch to ROKO Network to use these features
          </span>
        </div>
      </Card>
    );
  };

  // Render balance section
  const renderBalanceSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">ROKO Balance</h3>
          <div className="text-2xl font-bold text-teal-400 mb-2">
            {web3.rokoBalance?.formatted || '0.0000'} ROKO
          </div>
          <div className="text-sm text-gray-400">
            ${((parseFloat(web3.rokoBalance?.formatted || '0') * 1.25).toFixed(2))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">pwROKO Balance</h3>
          <div className="text-2xl font-bold text-purple-400 mb-2">
            {web3.pwRokoBalance?.formatted || '0.0000'} pwROKO
          </div>
          <div className="text-sm text-gray-400">
            Voting Power: {formatEther(web3.votingPower)}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Staking Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-400">Staked Amount</div>
            <div className="text-xl font-semibold text-white">
              {formatEther(web3.stakingInfo.staked)} ROKO
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Pending Rewards</div>
            <div className="text-xl font-semibold text-green-400">
              {formatEther(web3.stakingInfo.rewards)} ROKO
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Lock End Time</div>
            <div className="text-xl font-semibold text-white">
              {web3.stakingInfo.lockEndTime > 0
                ? new Date(web3.stakingInfo.lockEndTime * 1000).toLocaleDateString()
                : 'Not locked'
              }
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  // Render staking section
  const renderStakingSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stake */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Stake ROKO</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount to Stake</label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="0.0"
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-teal-500 focus:outline-none"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleStake}
              disabled={!stakeAmount || isLoading || !isROKOChain(chainId)}
              className="w-full"
            >
              {isLoading ? 'Staking...' : 'Stake ROKO'}
            </Button>
          </div>
        </Card>

        {/* Unstake */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Unstake ROKO</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount to Unstake</label>
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                placeholder="0.0"
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-teal-500 focus:outline-none"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleUnstake}
              disabled={!unstakeAmount || isLoading || !isROKOChain(chainId)}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Unstaking...' : 'Unstake ROKO'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Claim Rewards */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">Claim Rewards</h3>
            <p className="text-gray-400">
              Available: {formatEther(web3.stakingInfo.rewards)} ROKO
            </p>
          </div>
          <Button
            onClick={handleClaimRewards}
            disabled={web3.stakingInfo.rewards === 0n || isLoading || !isROKOChain(chainId)}
          >
            {isLoading ? 'Claiming...' : 'Claim Rewards'}
          </Button>
        </div>
      </Card>
    </div>
  );

  // Render governance section
  const renderGovernanceSection = () => (
    <div className="space-y-6">
      {/* Gasless voting toggle */}
      {isGaslessEnabled && (
        <Card className="p-4 bg-teal-900/20 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Gasless Voting Available</h4>
              <p className="text-sm text-gray-400">Vote without paying gas fees</p>
            </div>
            <div className="w-3 h-3 bg-teal-400 rounded-full" />
          </div>
        </Card>
      )}

      {/* Voting Power */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Your Voting Power</h3>
        <div className="text-2xl font-bold text-purple-400">
          {formatEther(web3.votingPower)} votes
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Based on your pwROKO balance and delegations
        </p>
      </Card>

      {/* Active Proposals */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Active Proposals</h3>
        <div className="space-y-4">
          {web3.proposals.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No active proposals
            </div>
          ) : (
            web3.proposals.map((proposal) => (
              <div
                key={proposal.id.toString()}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedProposal === proposal.id
                    ? 'border-teal-500 bg-teal-900/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => setSelectedProposal(proposal.id)}
              >
                <h4 className="text-white font-medium">{proposal.title}</h4>
                <p className="text-gray-400 text-sm mt-1">{proposal.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm text-gray-400">
                    Ends: {new Date(proposal.endTime * 1000).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="text-green-400">For: {formatEther(proposal.forVotes)}</span>
                    <span className="text-red-400 ml-4">Against: {formatEther(proposal.againstVotes)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Vote Form */}
      {selectedProposal && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Cast Your Vote</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Vote Type</label>
              <div className="flex space-x-2">
                {[
                  { value: 1, label: 'For', color: 'bg-green-600' },
                  { value: 0, label: 'Against', color: 'bg-red-600' },
                  { value: 2, label: 'Abstain', color: 'bg-gray-600' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setVoteType(option.value as VoteType)}
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                      voteType === option.value ? option.color : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Reason (Optional)</label>
              <textarea
                value={voteReason}
                onChange={(e) => setVoteReason(e.target.value)}
                placeholder="Explain your vote..."
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-teal-500 focus:outline-none"
                rows={3}
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleVote}
              disabled={isLoading || web3.votingPower === 0n || !isROKOChain(chainId)}
              className="w-full"
            >
              {isLoading
                ? 'Submitting Vote...'
                : isGaslessEnabled
                  ? 'Vote (Gasless)'
                  : 'Vote'
              }
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  if (!isConnected) {
    return (
      <div className={`${className}`}>
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">
            Connect your wallet to interact with ROKO Network
          </p>
          <ConnectWallet />
        </Card>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {renderNetworkWarning()}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'balance', label: 'Balances' },
          { id: 'staking', label: 'Staking' },
          { id: 'governance', label: 'Governance' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'balance' && renderBalanceSection()}
      {activeTab === 'staking' && renderStakingSection()}
      {activeTab === 'governance' && renderGovernanceSection()}

      {/* Status Messages */}
      {error && (
        <Card className="mt-6 p-4 bg-red-900/20 border-red-500">
          <div className="text-red-300">{error}</div>
        </Card>
      )}

      {txHash && (
        <Card className="mt-6 p-4 bg-green-900/20 border-green-500">
          <div className="text-green-300">
            Transaction submitted:
            <a
              href={`https://explorer.roko.network/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 underline hover:no-underline"
            >
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </a>
          </div>
        </Card>
      )}

      {/* Loading Overlay */}
      {web3.isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-400" />
              <span className="text-white">Loading Web3 data...</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Web3Example;