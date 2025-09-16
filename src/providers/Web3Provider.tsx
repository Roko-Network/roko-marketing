import React, { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, Theme, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '../lib/wagmi';
import { rokoNetwork } from '../config/chains';
import { COLORS } from '../config/constants';
import '@rainbow-me/rainbowkit/styles.css';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Custom ROKO theme for RainbowKit
const rokoTheme: Theme = {
  ...darkTheme({
    accentColor: COLORS.teal,
    accentColorForeground: COLORS.white,
    borderRadius: 'medium',
    fontStack: 'system',
    overlayBlur: 'small',
  }),
  colors: {
    ...darkTheme().colors,
    accentColor: COLORS.teal,
    accentColorForeground: COLORS.white,
    actionButtonBorder: COLORS.border.dark,
    actionButtonBorderMobile: COLORS.border.dark,
    actionButtonSecondaryBackground: COLORS.background.dark,
    closeButton: COLORS.primary,
    closeButtonBackground: COLORS.background.dark,
    connectButtonBackground: COLORS.background.dark,
    connectButtonBackgroundError: COLORS.status.error,
    connectButtonInnerBackground: COLORS.background.dark,
    connectButtonText: COLORS.text.inverse,
    connectButtonTextError: COLORS.white,
    connectionIndicator: COLORS.teal,
    downloadBottomCardBackground: COLORS.background.dark,
    downloadTopCardBackground: COLORS.background.dark,
    error: COLORS.status.error,
    generalBorder: COLORS.border.dark,
    generalBorderDim: COLORS.border.medium,
    menuItemBackground: COLORS.background.dark,
    modalBackdrop: 'rgba(0, 0, 0, 0.8)',
    modalBackground: COLORS.background.dark,
    modalBorder: COLORS.border.dark,
    modalText: COLORS.text.inverse,
    modalTextDim: COLORS.primary,
    modalTextSecondary: COLORS.secondary,
    profileAction: COLORS.background.dark,
    profileActionHover: COLORS.teal + '20',
    profileForeground: COLORS.background.dark,
    selectedOptionBorder: COLORS.teal,
    standby: COLORS.text.secondary,
  },
  fonts: {
    body: 'HK Guise, system-ui, sans-serif',
  },
  radii: {
    actionButton: '8px',
    connectButton: '8px',
    menuButton: '8px',
    modal: '12px',
    modalMobile: '12px',
  },
  shadows: {
    connectButton: '0 4px 12px rgba(0, 212, 170, 0.15)',
    dialog: '0 8px 32px rgba(0, 0, 0, 0.4)',
    profileDetailsAction: '0 2px 6px rgba(0, 0, 0, 0.15)',
    selectedOption: '0 2px 6px rgba(0, 212, 170, 0.2)',
    selectedWallet: '0 2px 6px rgba(0, 212, 170, 0.2)',
    walletLogo: '0 2px 16px rgba(0, 0, 0, 0.16)',
  },
};

interface Web3ProviderProps {
  children: ReactNode;
  theme?: 'light' | 'dark' | 'auto';
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({
  children,
  theme = 'dark'
}) => {
  // Determine theme based on prop and system preference
  const getTheme = () => {
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? rokoTheme
        : lightTheme({
            accentColor: COLORS.teal,
            accentColorForeground: COLORS.white,
          });
    }
    return theme === 'dark' ? rokoTheme : lightTheme({
      accentColor: COLORS.teal,
      accentColorForeground: COLORS.white,
    });
  };

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={getTheme()}
          initialChain={rokoNetwork}
          showRecentTransactions={true}
          modalSize="compact"
          coolMode={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

// Hook to access Web3 context
export const useWeb3Context = () => {
  return {
    queryClient,
    theme: rokoTheme,
  };
};

// Error boundary for Web3 errors
interface Web3ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class Web3ErrorBoundary extends React.Component<
  { children: ReactNode },
  Web3ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Web3ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Web3 Error:', error, errorInfo);

    // Report to analytics service if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">
              Web3 Connection Error
            </h2>
            <p className="text-gray-300 mb-6">
              There was an error connecting to the blockchain. Please check your wallet connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default Web3Provider;