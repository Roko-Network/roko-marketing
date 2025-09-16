# ROKO Network Web3 Integration Guide

This guide explains how to use the complete Web3 integration for ROKO Network, including wallet connection, staking, governance, and gasless voting.

## Overview

The Web3 integration provides:

- **Multi-wallet support**: MetaMask, WalletConnect, Coinbase Wallet
- **Chain management**: ROKO Network with fallbacks
- **Token interactions**: ROKO and pwROKO tokens
- **Staking interface**: Stake, unstake, and claim rewards
- **Governance system**: Proposals, voting, delegation
- **Gasless voting**: ERC4337 account abstraction
- **Real-time updates**: WebSocket subscriptions
- **Type safety**: Full TypeScript support

## Quick Start

### 1. Wrap Your App with Web3Provider

```tsx
import { Web3Provider, Web3ErrorBoundary } from './providers/Web3Provider';

function App() {
  return (
    <Web3ErrorBoundary>
      <Web3Provider theme="dark">
        <YourApp />
      </Web3Provider>
    </Web3ErrorBoundary>
  );
}
```

### 2. Add Connect Wallet Button

```tsx
import { ConnectWallet } from './components/molecules/ConnectWallet';

function Header() {
  return (
    <header>
      <ConnectWallet
        variant="default"
        showBalance={true}
        showNetwork={true}
      />
    </header>
  );
}
```

### 3. Use Web3 Hooks

```tsx
import { useWeb3 } from './hooks/useWeb3';

function Dashboard() {
  const {
    address,
    isConnected,
    rokoBalance,
    pwRokoBalance,
    stakingInfo,
    proposals,
    votingPower
  } = useWeb3();

  if (!isConnected) {
    return <ConnectWallet />;
  }

  return (
    <div>
      <h2>Balance: {rokoBalance?.formatted} ROKO</h2>
      <h3>Voting Power: {formatEther(votingPower)}</h3>
      {/* Your dashboard content */}
    </div>
  );
}
```

## Components

### ConnectWallet

A comprehensive wallet connection component with multiple variants:

```tsx
// Default variant with full information
<ConnectWallet />

// Compact variant for headers
<ConnectWallet variant="compact" />

// Icon-only variant for mobile
<ConnectWallet variant="icon" />

// Customized styling
<ConnectWallet
  variant="default"
  showBalance={true}
  showNetwork={true}
  className="custom-styles"
/>
```

### Web3Example

A complete example component demonstrating all features:

```tsx
import { Web3Example } from './components/examples/Web3Example';

function ExamplePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Web3 Integration Demo</h1>
      <Web3Example />
    </div>
  );
}
```

## Hooks

### useWeb3()

Main hook for Web3 functionality:

```tsx
const {
  // Account
  address,
  isConnected,
  chainId,
  isCorrectNetwork,

  // Balances
  rokoBalance,
  pwRokoBalance,

  // Staking
  stakingInfo,
  stake,
  unstake,
  claimRewards,
  delegate,

  // Governance
  proposals,
  proposalCount,
  votingPower,
  castVote,
  castVoteWithReason,

  // Loading states
  isLoading,
  isPending
} = useWeb3();
```

### Individual Hooks

For more granular control:

```tsx
// Token balances
const { balance, isLoading, refetch } = useROKOBalance(address);
const { balance: pwBalance } = usePwROKOBalance(address);

// Staking operations
const {
  stakingInfo,
  stake,
  unstake,
  claimRewards,
  delegate,
  isPending
} = useStaking();

// Governance
const { proposals, isLoading } = useProposals();
const { castVote, votingPower } = useVoting();

// Token prices
const { price, isLoading } = useTokenPrice(tokenAddress);
```

## Contract Interactions

### Direct Contract Service

For advanced use cases, use the contract service directly:

```tsx
import { contractService, createContractService } from './services/contracts';

// Using singleton instance
const balance = await contractService.getROKOBalance(address);

// Creating custom instance with wallet
const walletClient = createWalletClientForProvider(window.ethereum);
const customService = createContractService(walletClient);

// Staking operations
await customService.stake(parseEther('100'));
await customService.claimStakingRewards();

// Governance operations
await customService.castVote(proposalId, VoteType.For);
await customService.delegateVotes(delegateeAddress);
```

### Error Handling

```tsx
import { handleContractError, ContractError } from './services/contracts';

try {
  await contractService.stake(amount);
} catch (error) {
  const contractError = handleContractError(error);

  switch (contractError.code) {
    case 'USER_REJECTED':
      console.log('User canceled transaction');
      break;
    case 'INSUFFICIENT_FUNDS':
      console.log('Insufficient funds');
      break;
    default:
      console.error('Transaction failed:', contractError.message);
  }
}
```

## Gasless Voting

### Enable Gasless Voting

Gasless voting is automatically enabled when the bundler and paymaster services are available:

```tsx
import { isGaslessAvailable, createGaslessVote } from './services/gasless';

// Check availability
const isAvailable = await isGaslessAvailable();

if (isAvailable) {
  // Create gasless vote
  const { userOp, userOpHash } = await createGaslessVote(
    userAddress,
    proposalId,
    VoteType.For,
    'Reason for voting'
  );

  // Wait for confirmation
  const receipt = await waitForGaslessVote(userOpHash);
}
```

### Session Keys

For improved UX, create session keys for repeated operations:

```tsx
import { useSessionKey } from './services/gasless';

function VotingInterface() {
  const { createVotingSessionKey, signWithSessionKey } = useSessionKey();

  const setupSessionKey = async () => {
    // Create session key for 24 hours
    const sessionKey = await createVotingSessionKey(24 * 60 * 60);

    // Store securely (e.g., encrypted in localStorage)
    localStorage.setItem('votingSessionKey', JSON.stringify(sessionKey));
  };

  const voteWithSession = async (proposalId: bigint, support: VoteType) => {
    const sessionKey = JSON.parse(localStorage.getItem('votingSessionKey') || '{}');

    // Create user operation
    const userOp = await gaslessVotingService.createGaslessVote(
      address,
      proposalId,
      support
    );

    // Sign with session key
    const signedUserOp = await signWithSessionKey(userOp, sessionKey);

    // Submit
    const userOpHash = await gaslessVotingService.submitUserOperation(signedUserOp);

    return userOpHash;
  };
}
```

## Chain Configuration

### Supported Networks

- **ROKO Network Mainnet**: Chain ID 12227332
- **ROKO Network Testnet**: Chain ID 12227333
- **Local Development**: Chain ID 31337

### Network Switching

```tsx
import { switchToROKONetwork } from './config/chains';

// Switch to ROKO Network
try {
  await switchToROKONetwork();
} catch (error) {
  console.error('Failed to switch network:', error);
}

// Check if on correct network
import { isROKOChain } from './config/chains';

if (!isROKOChain(chainId)) {
  // Show network switch prompt
}
```

## Environment Variables

Set up your environment variables:

```env
# Wallet Connect
VITE_WALLETCONNECT_PROJECT_ID=your_project_id

# RPC Providers (optional fallbacks)
VITE_INFURA_API_KEY=your_infura_key
VITE_ALCHEMY_API_KEY=your_alchemy_key

# Analytics (optional)
VITE_GA_TRACKING_ID=your_ga_id
```

## TypeScript Types

The integration provides comprehensive TypeScript types:

```tsx
import type {
  TokenBalance,
  StakingInfo,
  Proposal,
  VoteType,
  UserOperation,
  SessionKey
} from './types/contracts';

// Type-safe contract interactions
const proposal: Proposal = {
  id: 1n,
  title: 'Example Proposal',
  description: 'Proposal description',
  // ... fully typed
};

// Type guards
import { isAddress, isHash, isVoteType } from './types/contracts';

if (isAddress(value)) {
  // value is now typed as Address
}
```

## Best Practices

### 1. Error Handling

Always wrap contract interactions in try-catch blocks and handle specific error types:

```tsx
try {
  await stake(amount);
} catch (error) {
  const contractError = handleContractError(error);

  // Show user-friendly error messages
  setError(contractError.message);

  // Log for debugging
  console.error('Staking failed:', contractError);
}
```

### 2. Loading States

Provide feedback during async operations:

```tsx
const [isStaking, setIsStaking] = useState(false);

const handleStake = async () => {
  setIsStaking(true);
  try {
    await stake(amount);
  } finally {
    setIsStaking(false);
  }
};

return (
  <Button disabled={isStaking}>
    {isStaking ? 'Staking...' : 'Stake ROKO'}
  </Button>
);
```

### 3. Transaction Monitoring

Monitor transaction status and provide updates:

```tsx
import { useTransactionStatus } from './hooks/useWeb3';

function TransactionStatus({ txHash }: { txHash?: string }) {
  const { isLoading, isSuccess, isError, confirmations } = useTransactionStatus(txHash);

  if (!txHash) return null;

  return (
    <div>
      {isLoading && <span>Transaction pending...</span>}
      {isSuccess && <span>Transaction confirmed! ({confirmations} confirmations)</span>}
      {isError && <span>Transaction failed</span>}
    </div>
  );
}
```

### 4. Network Validation

Always check network before contract interactions:

```tsx
import { isROKOChain } from './config/chains';

const handleTransaction = async () => {
  if (!isROKOChain(chainId)) {
    setError('Please switch to ROKO Network');
    return;
  }

  // Proceed with transaction
};
```

## Testing

### Mock Providers for Testing

```tsx
// Test setup
import { createMockProvider } from './test/mockProvider';

const MockWeb3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Web3Provider theme="dark">
      {children}
    </Web3Provider>
  );
};

// Test component
test('should display wallet connection', () => {
  render(
    <MockWeb3Provider>
      <ConnectWallet />
    </MockWeb3Provider>
  );

  expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
});
```

## Performance Optimization

### 1. Query Optimization

Queries are automatically optimized with:
- 5-minute stale time
- Automatic retries with exponential backoff
- Request deduplication
- Background refetching

### 2. Bundle Optimization

The Web3 integration is tree-shakable:

```tsx
// Import only what you need
import { useROKOBalance } from './hooks/useWeb3';
import { contractService } from './services/contracts';
```

### 3. Caching

- Contract read results are cached
- Balance updates are batched
- RPC calls are optimized with multicall

## Troubleshooting

### Common Issues

1. **"Chain not supported"**: Add ROKO Network to your wallet
2. **"Insufficient funds"**: Check ROKO token balance
3. **"Transaction reverted"**: Check contract requirements
4. **"Gasless not available"**: Bundler/paymaster service down

### Debug Mode

Enable debug logging:

```tsx
// In development
localStorage.setItem('debug', 'roko:web3:*');

// This will log all Web3 operations
```

## Example Implementation

See `src/components/examples/Web3Example.tsx` for a complete implementation demonstrating:

- Wallet connection
- Token balances
- Staking operations
- Governance voting
- Gasless transactions
- Error handling
- Loading states

This example serves as a reference for implementing Web3 features in your application.