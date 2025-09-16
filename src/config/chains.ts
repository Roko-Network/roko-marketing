import { defineChain } from 'viem';
import { WEB3_CONFIG } from './constants';

// ROKO Network mainnet configuration
export const rokoNetwork = defineChain({
  id: WEB3_CONFIG.chainId,
  name: WEB3_CONFIG.chainName,
  nativeCurrency: WEB3_CONFIG.nativeCurrency,
  rpcUrls: {
    public: { http: WEB3_CONFIG.rpcUrls },
    default: { http: WEB3_CONFIG.rpcUrls },
  },
  blockExplorers: {
    default: {
      name: 'ROKO Explorer',
      url: WEB3_CONFIG.blockExplorerUrls[0],
      apiUrl: `${WEB3_CONFIG.blockExplorerUrls[0]}/api`
    },
  },
  contracts: {
    // ENS registry (if supported)
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    // Multicall3 for batch calls
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1,
    },
  },
  testnet: false,
});

// ROKO Network testnet configuration
export const rokoTestnet = defineChain({
  id: 12227333, // Different chain ID for testnet
  name: 'ROKO Network Testnet',
  nativeCurrency: {
    name: 'Test ROKO',
    symbol: 'tROKO',
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ['https://testnet-rpc.roko.network'] },
    default: { http: ['https://testnet-rpc.roko.network'] },
  },
  blockExplorers: {
    default: {
      name: 'ROKO Testnet Explorer',
      url: 'https://testnet-explorer.roko.network',
      apiUrl: 'https://testnet-explorer.roko.network/api'
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1,
    },
  },
  testnet: true,
});

// Local development chain
export const rokoLocal = defineChain({
  id: 31337,
  name: 'ROKO Local',
  nativeCurrency: {
    name: 'Local ROKO',
    symbol: 'lROKO',
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ['http://127.0.0.1:8545'] },
    default: { http: ['http://127.0.0.1:8545'] },
  },
  testnet: true,
});

// Export all supported chains
export const supportedChains = [rokoNetwork, rokoTestnet] as const;
export const devChains = [rokoLocal] as const;

// Chain utilities
export const getChainById = (chainId: number) => {
  return [...supportedChains, ...devChains].find(chain => chain.id === chainId);
};

export const isROKOChain = (chainId: number) => {
  return [rokoNetwork.id, rokoTestnet.id, rokoLocal.id].includes(chainId);
};

export const getExplorerUrl = (chainId: number, hash: string, type: 'tx' | 'address' | 'block' = 'tx') => {
  const chain = getChainById(chainId);
  if (!chain?.blockExplorers?.default?.url) return '';

  const baseUrl = chain.blockExplorers.default.url;
  switch (type) {
    case 'tx':
      return `${baseUrl}/tx/${hash}`;
    case 'address':
      return `${baseUrl}/address/${hash}`;
    case 'block':
      return `${baseUrl}/block/${hash}`;
    default:
      return baseUrl;
  }
};

// Network switching utilities
export const switchToROKONetwork = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${rokoNetwork.id.toString(16)}` }],
    });
  } catch (switchError: any) {
    // Chain not added to wallet
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${rokoNetwork.id.toString(16)}`,
          chainName: rokoNetwork.name,
          nativeCurrency: rokoNetwork.nativeCurrency,
          rpcUrls: rokoNetwork.rpcUrls.default.http,
          blockExplorerUrls: [rokoNetwork.blockExplorers.default.url],
        }],
      });
    } else {
      throw switchError;
    }
  }
};