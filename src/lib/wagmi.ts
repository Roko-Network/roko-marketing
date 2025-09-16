// Wagmi configuration for Web3 integration
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { rokoNetwork, rokoTestnet, rokoLocal, supportedChains, devChains } from '../config/chains';
import { ENV } from '../config/constants';

// Determine which chains to include based on environment
const getChains = () => {
  const chains = [...supportedChains];

  if (ENV.isDev) {
    chains.push(...devChains, hardhat, sepolia);
  }

  // Add mainnet for wallet compatibility
  chains.push(mainnet);

  return chains;
};

// Create transports for each chain
const transports = {
  [rokoNetwork.id]: http(rokoNetwork.rpcUrls.default.http[0]),
  [rokoTestnet.id]: http(rokoTestnet.rpcUrls.default.http[0]),
  [mainnet.id]: http(`https://mainnet.infura.io/v3/${ENV.infuraApiKey}`),
  [sepolia.id]: http(`https://sepolia.infura.io/v3/${ENV.infuraApiKey}`),
  ...(ENV.isDev && {
    [rokoLocal.id]: http(rokoLocal.rpcUrls.default.http[0]),
    [hardhat.id]: http(hardhat.rpcUrls.default.http[0])
  })
};

// Wallet connectors
const connectors = [
  injected({
    target: 'metaMask',
  }),
  walletConnect({
    projectId: ENV.walletConnectProjectId,
    metadata: {
      name: 'ROKO Network',
      description: 'The Temporal Layer for Web3',
      url: 'https://roko.network',
      icons: ['https://roko.network/logo.png']
    },
    showQrModal: true
  }),
  coinbaseWallet({
    appName: 'ROKO Network',
    appLogoUrl: 'https://roko.network/logo.png'
  })
];

// Wagmi configuration using new API
export const wagmiConfig = createConfig({
  chains: getChains(),
  connectors,
  transports,
  ssr: false
});

// Legacy RainbowKit config for backwards compatibility
export const rainbowKitConfig = getDefaultConfig({
  appName: 'ROKO Network',
  projectId: ENV.walletConnectProjectId || 'default-project-id',
  chains: getChains(),
  ssr: false
});

export { rokoNetwork, rokoTestnet, rokoLocal };