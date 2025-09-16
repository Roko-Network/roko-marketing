import {
  type Address,
  type Hash,
  type Hex,
  encodeFunctionData,
  parseEther,
  createPublicClient,
  http,
} from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { rokoNetwork } from '../config/chains';
import { WEB3_CONFIG } from '../config/constants';
import { GOVERNANCE_ABI } from './contracts';

// ERC4337 UserOperation structure
export interface UserOperation {
  sender: Address;
  nonce: bigint;
  initCode: Hex;
  callData: Hex;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: Hex;
  signature: Hex;
}

// Bundler response types
export interface BundlerResponse<T = any> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface UserOperationReceipt {
  userOpHash: Hash;
  entryPoint: Address;
  sender: Address;
  nonce: bigint;
  paymaster?: Address;
  actualGasCost: bigint;
  actualGasUsed: bigint;
  success: boolean;
  logs: any[];
  receipt: {
    transactionHash: Hash;
    blockNumber: bigint;
    blockHash: Hash;
    gasUsed: bigint;
  };
}

// Session key management for better UX
export interface SessionKey {
  privateKey: Hex;
  publicKey: Address;
  validAfter: number;
  validUntil: number;
  permissions: SessionPermissions;
}

export interface SessionPermissions {
  allowedContracts: Address[];
  allowedFunctions: string[];
  spendingLimit: bigint;
  timeLimit: number;
}

// Gasless voting service
export class GaslessVotingService {
  private bundlerUrl: string;
  private paymasterUrl: string;
  private entryPointAddress: Address;
  private publicClient;

  constructor() {
    this.bundlerUrl = WEB3_CONFIG.aa.bundlerUrl;
    this.paymasterUrl = WEB3_CONFIG.aa.paymasterUrl;
    this.entryPointAddress = WEB3_CONFIG.aa.entryPointAddress as Address;
    this.publicClient = createPublicClient({
      chain: rokoNetwork,
      transport: http(),
    });
  }

  // Create a gasless vote transaction
  async createGaslessVote(
    userAddress: Address,
    proposalId: bigint,
    support: 0 | 1 | 2,
    reason?: string
  ): Promise<UserOperation> {
    // Encode the vote function call
    const callData = reason
      ? encodeFunctionData({
          abi: GOVERNANCE_ABI,
          functionName: 'castVoteWithReason',
          args: [proposalId, support, reason],
        })
      : encodeFunctionData({
          abi: GOVERNANCE_ABI,
          functionName: 'castVote',
          args: [proposalId, support],
        });

    // Get user operation nonce
    const nonce = await this.getUserOperationNonce(userAddress);

    // Estimate gas limits
    const gasEstimate = await this.estimateUserOperationGas({
      sender: userAddress,
      nonce,
      initCode: '0x',
      callData,
    });

    // Get paymaster data for sponsored transaction
    const paymasterAndData = await this.getPaymasterData({
      sender: userAddress,
      nonce,
      initCode: '0x',
      callData,
      callGasLimit: gasEstimate.callGasLimit,
      verificationGasLimit: gasEstimate.verificationGasLimit,
      preVerificationGas: gasEstimate.preVerificationGas,
    });

    // Get current gas prices
    const feeData = await this.publicClient.estimateFeesPerGas();

    const userOp: Partial<UserOperation> = {
      sender: userAddress,
      nonce,
      initCode: '0x',
      callData,
      callGasLimit: gasEstimate.callGasLimit,
      verificationGasLimit: gasEstimate.verificationGasLimit,
      preVerificationGas: gasEstimate.preVerificationGas,
      maxFeePerGas: feeData.maxFeePerGas || parseEther('0.001'),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || parseEther('0.001'),
      paymasterAndData,
      signature: '0x', // Will be filled after signing
    };

    return userOp as UserOperation;
  }

  // Submit user operation to bundler
  async submitUserOperation(userOp: UserOperation): Promise<Hash> {
    const response = await this.callBundler('eth_sendUserOperation', [
      this.formatUserOperation(userOp),
      this.entryPointAddress,
    ]);

    if (response.error) {
      throw new Error(`Bundler error: ${response.error.message}`);
    }

    return response.result as Hash;
  }

  // Wait for user operation to be mined
  async waitForUserOperation(userOpHash: Hash): Promise<UserOperationReceipt> {
    let receipt: UserOperationReceipt | null = null;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals

    while (!receipt && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));

      try {
        const response = await this.callBundler('eth_getUserOperationReceipt', [userOpHash]);

        if (response.result) {
          receipt = response.result as UserOperationReceipt;
        }
      } catch (error) {
        console.log('Waiting for user operation...', error);
      }

      attempts++;
    }

    if (!receipt) {
      throw new Error('User operation not mined within timeout');
    }

    return receipt;
  }

  // Session key management
  async createSessionKey(
    permissions: SessionPermissions,
    validFor: number = 24 * 60 * 60 // 24 hours default
  ): Promise<SessionKey> {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    const now = Math.floor(Date.now() / 1000);

    return {
      privateKey,
      publicKey: account.address,
      validAfter: now,
      validUntil: now + validFor,
      permissions,
    };
  }

  // Sign user operation with session key
  async signUserOperationWithSessionKey(
    userOp: UserOperation,
    sessionKey: SessionKey
  ): Promise<UserOperation> {
    // Validate session key permissions
    this.validateSessionKey(sessionKey, userOp);

    // Create account from session key
    const account = privateKeyToAccount(sessionKey.privateKey);

    // Calculate user operation hash
    const userOpHash = await this.getUserOperationHash(userOp);

    // Sign the hash
    const signature = await account.signMessage({
      message: { raw: userOpHash },
    });

    return {
      ...userOp,
      signature,
    };
  }

  // Validate session key permissions
  private validateSessionKey(sessionKey: SessionKey, userOp: UserOperation): void {
    const now = Math.floor(Date.now() / 1000);

    // Check time validity
    if (now < sessionKey.validAfter || now > sessionKey.validUntil) {
      throw new Error('Session key expired or not yet valid');
    }

    // Check contract permissions (if voting, governance contract should be allowed)
    const governanceAddress = WEB3_CONFIG.contracts.GOVERNANCE as Address;
    if (!sessionKey.permissions.allowedContracts.includes(governanceAddress)) {
      throw new Error('Session key not authorized for governance contract');
    }

    // Check function permissions (voting functions should be allowed)
    const allowedFunctions = ['castVote', 'castVoteWithReason'];
    const hasPermission = allowedFunctions.some(func =>
      sessionKey.permissions.allowedFunctions.includes(func)
    );

    if (!hasPermission) {
      throw new Error('Session key not authorized for voting functions');
    }
  }

  // Get user operation nonce
  private async getUserOperationNonce(sender: Address): Promise<bigint> {
    const response = await this.callBundler('eth_getUserOperationByHash', [
      sender,
      this.entryPointAddress,
    ]);

    return BigInt(response.result?.nonce || 0);
  }

  // Estimate gas for user operation
  private async estimateUserOperationGas(
    userOp: Partial<UserOperation>
  ): Promise<{
    callGasLimit: bigint;
    verificationGasLimit: bigint;
    preVerificationGas: bigint;
  }> {
    const response = await this.callBundler('eth_estimateUserOperationGas', [
      this.formatUserOperation(userOp),
      this.entryPointAddress,
    ]);

    if (response.error) {
      throw new Error(`Gas estimation failed: ${response.error.message}`);
    }

    return {
      callGasLimit: BigInt(response.result.callGasLimit),
      verificationGasLimit: BigInt(response.result.verificationGasLimit),
      preVerificationGas: BigInt(response.result.preVerificationGas),
    };
  }

  // Get paymaster data for sponsored transaction
  private async getPaymasterData(userOp: Partial<UserOperation>): Promise<Hex> {
    try {
      const response = await fetch(this.paymasterUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'pm_sponsorUserOperation',
          params: [
            this.formatUserOperation(userOp),
            this.entryPointAddress,
            {
              type: 'voting', // Special context for voting transactions
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.warn('Paymaster sponsorship failed:', data.error.message);
        return '0x'; // Fallback to user-paid transaction
      }

      return data.result.paymasterAndData || '0x';
    } catch (error) {
      console.warn('Paymaster service unavailable:', error);
      return '0x'; // Fallback to user-paid transaction
    }
  }

  // Calculate user operation hash
  private async getUserOperationHash(userOp: UserOperation): Promise<Hash> {
    const response = await this.callBundler('eth_getUserOperationHash', [
      this.formatUserOperation(userOp),
      this.entryPointAddress,
    ]);

    return response.result as Hash;
  }

  // Call bundler RPC
  private async callBundler(method: string, params: any[]): Promise<BundlerResponse> {
    const response = await fetch(this.bundlerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
    });

    return response.json();
  }

  // Format user operation for RPC calls
  private formatUserOperation(userOp: Partial<UserOperation>): Record<string, string> {
    return {
      sender: userOp.sender || '0x',
      nonce: `0x${(userOp.nonce || 0n).toString(16)}`,
      initCode: userOp.initCode || '0x',
      callData: userOp.callData || '0x',
      callGasLimit: `0x${(userOp.callGasLimit || 0n).toString(16)}`,
      verificationGasLimit: `0x${(userOp.verificationGasLimit || 0n).toString(16)}`,
      preVerificationGas: `0x${(userOp.preVerificationGas || 0n).toString(16)}`,
      maxFeePerGas: `0x${(userOp.maxFeePerGas || 0n).toString(16)}`,
      maxPriorityFeePerGas: `0x${(userOp.maxPriorityFeePerGas || 0n).toString(16)}`,
      paymasterAndData: userOp.paymasterAndData || '0x',
      signature: userOp.signature || '0x',
    };
  }

  // Check if gasless voting is available
  async isGaslessVotingAvailable(): Promise<boolean> {
    try {
      // Check if bundler is responding
      const response = await this.callBundler('eth_chainId', []);

      // Check if paymaster is available
      const paymasterResponse = await fetch(this.paymasterUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'pm_getPaymasterInfo',
          params: [],
        }),
      });

      return !response.error && paymasterResponse.ok;
    } catch (error) {
      console.warn('Gasless voting not available:', error);
      return false;
    }
  }

  // Fallback to regular transaction
  async fallbackToRegularTransaction(
    userOp: UserOperation
  ): Promise<{ callData: Hex; target: Address }> {
    return {
      callData: userOp.callData,
      target: WEB3_CONFIG.contracts.GOVERNANCE as Address,
    };
  }
}

// Export singleton instance
export const gaslessVotingService = new GaslessVotingService();

// Utility functions for gasless voting
export const createGaslessVote = async (
  userAddress: Address,
  proposalId: bigint,
  support: 0 | 1 | 2,
  reason?: string
): Promise<{ userOp: UserOperation; userOpHash: Hash }> => {
  const userOp = await gaslessVotingService.createGaslessVote(
    userAddress,
    proposalId,
    support,
    reason
  );

  const userOpHash = await gaslessVotingService.submitUserOperation(userOp);

  return { userOp, userOpHash };
};

export const waitForGaslessVote = async (userOpHash: Hash): Promise<UserOperationReceipt> => {
  return gaslessVotingService.waitForUserOperation(userOpHash);
};

export const isGaslessAvailable = (): Promise<boolean> => {
  return gaslessVotingService.isGaslessVotingAvailable();
};

// Hook for managing session keys in React components
export const useSessionKey = () => {
  const createVotingSessionKey = async (validFor?: number): Promise<SessionKey> => {
    const permissions: SessionPermissions = {
      allowedContracts: [WEB3_CONFIG.contracts.GOVERNANCE as Address],
      allowedFunctions: ['castVote', 'castVoteWithReason'],
      spendingLimit: 0n, // No spending for voting
      timeLimit: validFor || 24 * 60 * 60, // 24 hours default
    };

    return gaslessVotingService.createSessionKey(permissions, validFor);
  };

  const signWithSessionKey = async (
    userOp: UserOperation,
    sessionKey: SessionKey
  ): Promise<UserOperation> => {
    return gaslessVotingService.signUserOperationWithSessionKey(userOp, sessionKey);
  };

  return {
    createVotingSessionKey,
    signWithSessionKey,
  };
};