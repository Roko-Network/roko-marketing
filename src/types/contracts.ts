import type { Address, Hash, TransactionReceipt } from 'viem';

// Base contract types
export interface ContractAddress {
  readonly address: Address;
  readonly chainId: number;
}

export interface TransactionOptions {
  gas?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  value?: bigint;
}

export interface TransactionResult {
  hash: Hash;
  wait: () => Promise<TransactionReceipt>;
}

// Token types
export interface TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

export interface TokenBalance {
  address: Address;
  balance: bigint;
  formatted: string;
  symbol: string;
  decimals: number;
}

export interface TokenAllowance {
  owner: Address;
  spender: Address;
  allowance: bigint;
  formatted: string;
}

// ROKO Token types
export interface ROKOToken extends TokenInfo {
  // Standard ERC20 functionality
}

export interface PwROKOToken extends TokenInfo {
  // Voting and delegation functionality
  votingPower: bigint;
  delegate?: Address;
}

// Staking types
export interface StakingPool {
  address: Address;
  token: Address;
  rewardToken: Address;
  totalStaked: bigint;
  rewardRate: bigint;
  lastUpdateTime: number;
  rewardPerTokenStored: bigint;
}

export interface UserStake {
  user: Address;
  amount: bigint;
  rewardDebt: bigint;
  lockEndTime: number;
  multiplier: number;
}

export interface StakingRewards {
  pending: bigint;
  claimed: bigint;
  total: bigint;
}

export interface StakingInfo {
  stake: UserStake;
  rewards: StakingRewards;
  pool: StakingPool;
  userVotingPower: bigint;
  canUnstake: boolean;
  timeUntilUnlock: number;
}

// Governance types
export enum ProposalState {
  Pending = 0,
  Active = 1,
  Canceled = 2,
  Defeated = 3,
  Succeeded = 4,
  Queued = 5,
  Expired = 6,
  Executed = 7,
}

export enum VoteType {
  Against = 0,
  For = 1,
  Abstain = 2,
}

export interface ProposalAction {
  target: Address;
  value: bigint;
  signature: string;
  calldata: `0x${string}`;
}

export interface ProposalCore {
  id: bigint;
  proposer: Address;
  targets: Address[];
  values: bigint[];
  signatures: string[];
  calldatas: `0x${string}`[];
  startBlock: bigint;
  endBlock: bigint;
  description: string;
}

export interface ProposalVotes {
  forVotes: bigint;
  againstVotes: bigint;
  abstainVotes: bigint;
}

export interface Proposal extends ProposalCore, ProposalVotes {
  state: ProposalState;
  eta: number;
  executed: boolean;
  canceled: boolean;
  actions: ProposalAction[];
  quorumReached: boolean;
  votingPeriodEnd: number;
  executionETA?: number;
}

export interface Vote {
  voter: Address;
  proposalId: bigint;
  support: VoteType;
  weight: bigint;
  reason?: string;
  timestamp: number;
  blockNumber: bigint;
}

export interface VotingPower {
  current: bigint;
  atBlock: Record<number, bigint>;
  delegated: bigint;
  delegatedFrom: Address[];
  delegatedTo?: Address;
}

// Reputation NFT types
export enum ReputationType {
  Contributor = 1,
  Developer = 2,
  Validator = 3,
  Governance = 4,
  Community = 5,
  Security = 6,
}

export interface ReputationMetadata {
  id: bigint;
  type: ReputationType;
  name: string;
  description: string;
  imageUrl: string;
  level: number;
  requirements: string[];
  benefits: string[];
}

export interface UserReputation {
  user: Address;
  tokenId: bigint;
  balance: bigint;
  metadata: ReputationMetadata;
  earnedAt: number;
  multiplier: number;
}

export interface ReputationSystem {
  totalReputation: bigint;
  types: ReputationType[];
  userReputations: UserReputation[];
  reputationScore: number;
  rank: number;
}

// Working Groups types
export enum WorkingGroupType {
  Technical = 'technical',
  Treasury = 'treasury',
  Community = 'community',
  Marketing = 'marketing',
  Security = 'security',
}

export interface WorkingGroup {
  id: bigint;
  type: WorkingGroupType;
  name: string;
  description: string;
  members: Address[];
  lead: Address;
  budget: bigint;
  proposals: bigint[];
  active: boolean;
  created: number;
}

export interface WorkingGroupMember {
  user: Address;
  group: WorkingGroupType;
  role: 'member' | 'lead' | 'contributor';
  joinedAt: number;
  contributions: number;
  votingWeight: bigint;
}

// DAO Treasury types
export interface TreasuryAsset {
  token: Address;
  balance: bigint;
  value: bigint; // USD value
  allocation: number; // Percentage
}

export interface Treasury {
  totalValue: bigint;
  assets: TreasuryAsset[];
  inflows: bigint;
  outflows: bigint;
  reserves: bigint;
  lastUpdate: number;
}

export interface TreasuryProposal {
  id: bigint;
  recipient: Address;
  amount: bigint;
  token: Address;
  purpose: string;
  workingGroup?: WorkingGroupType;
  milestones: string[];
  approved: boolean;
  executed: boolean;
}

// Event types
export interface ContractEvent {
  address: Address;
  blockNumber: bigint;
  blockHash: Hash;
  transactionHash: Hash;
  transactionIndex: number;
  logIndex: number;
  removed: boolean;
}

export interface StakeEvent extends ContractEvent {
  user: Address;
  amount: bigint;
  newTotal: bigint;
}

export interface UnstakeEvent extends ContractEvent {
  user: Address;
  amount: bigint;
  penalty: bigint;
  newTotal: bigint;
}

export interface VoteEvent extends ContractEvent {
  voter: Address;
  proposalId: bigint;
  support: VoteType;
  weight: bigint;
  reason?: string;
}

export interface ProposalCreatedEvent extends ContractEvent {
  proposalId: bigint;
  proposer: Address;
  description: string;
  startBlock: bigint;
  endBlock: bigint;
}

export interface ProposalExecutedEvent extends ContractEvent {
  proposalId: bigint;
  executor: Address;
}

export interface DelegateEvent extends ContractEvent {
  delegator: Address;
  fromDelegate: Address;
  toDelegate: Address;
}

export interface ReputationMintedEvent extends ContractEvent {
  to: Address;
  tokenId: bigint;
  amount: bigint;
  type: ReputationType;
}

// API response types
export interface ContractCallResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  gasUsed?: bigint;
  blockNumber?: bigint;
}

export interface MultiCallResult {
  success: boolean;
  results: ContractCallResult[];
  blockNumber: bigint;
}

// Transaction types
export interface PendingTransaction {
  hash: Hash;
  type: string;
  timestamp: number;
  from: Address;
  to: Address;
  value: bigint;
  gasLimit: bigint;
  gasPrice: bigint;
}

export interface TransactionStatus {
  hash: Hash;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  blockNumber?: bigint;
  gasUsed?: bigint;
  effectiveGasPrice?: bigint;
  error?: string;
}

// Error types
export interface ContractError {
  code: string;
  message: string;
  data?: any;
  transaction?: PendingTransaction;
}

export enum ErrorCode {
  USER_REJECTED = 'USER_REJECTED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  EXECUTION_REVERTED = 'EXECUTION_REVERTED',
  INVALID_PARAMS = 'INVALID_PARAMS',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONTRACT_NOT_FOUND = 'CONTRACT_NOT_FOUND',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Configuration types
export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface ContractConfig {
  address: Address;
  abi: any[];
  deployedBlock?: bigint;
}

export interface Web3Config {
  chains: ChainConfig[];
  contracts: Record<string, ContractConfig>;
  rpcUrls: Record<number, string[]>;
  walletConnectProjectId: string;
  infuraApiKey?: string;
  alchemyApiKey?: string;
}

// Utility types
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Re-export commonly used types from viem
export type {
  Address,
  Hash,
  TransactionReceipt,
  Log,
  Block,
  Transaction,
} from 'viem';

// Type guards
export const isAddress = (value: any): value is Address => {
  return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value);
};

export const isHash = (value: any): value is Hash => {
  return typeof value === 'string' && /^0x[a-fA-F0-9]{64}$/.test(value);
};

export const isProposalState = (value: any): value is ProposalState => {
  return Object.values(ProposalState).includes(value);
};

export const isVoteType = (value: any): value is VoteType => {
  return Object.values(VoteType).includes(value);
};

export const isReputationType = (value: any): value is ReputationType => {
  return Object.values(ReputationType).includes(value);
};

export const isWorkingGroupType = (value: any): value is WorkingGroupType => {
  return Object.values(WorkingGroupType).includes(value);
};