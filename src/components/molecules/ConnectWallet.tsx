import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useEnsName } from 'wagmi';
import { useChainId, useSwitchChain } from 'wagmi';
import { rokoNetwork, getExplorerUrl, isROKOChain } from '../../config/chains';
import { COLORS, WEB3_CONFIG } from '../../config/constants';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ConnectWalletProps {
  variant?: 'default' | 'compact' | 'icon';
  showBalance?: boolean;
  showNetwork?: boolean;
  className?: string;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  variant = 'default',
  showBalance = true,
  showNetwork = true,
  className = '',
}) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);

  const { data: ensName } = useEnsName({
    address,
    chainId: 1, // ENS is on mainnet
  });

  const { data: rokoBalance } = useBalance({
    address,
    token: WEB3_CONFIG.contracts.ROKO_TOKEN as `0x${string}`,
    query: {
      enabled: !!address && isROKOChain(chainId),
    },
  });

  const { data: nativeBalance } = useBalance({
    address,
    query: {
      enabled: !!address,
    },
  });

  // Format address for display
  const formatAddress = (addr: string) => {
    if (ensName) return ensName;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Format balance for display
  const formatBalance = (balance: bigint | undefined, decimals: number = 18, symbol: string = 'ROKO') => {
    if (!balance) return '0';
    const formatted = Number(balance) / Math.pow(10, decimals);
    return `${formatted.toFixed(4)} ${symbol}`;
  };

  // Handle network switching
  const handleNetworkSwitch = () => {
    if (chainId !== rokoNetwork.id) {
      switchChain({ chainId: rokoNetwork.id });
    }
  };

  // Network indicator component
  const NetworkIndicator: React.FC = () => {
    const isCorrectNetwork = isROKOChain(chainId);

    return (
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isCorrectNetwork ? 'bg-green-400' : 'bg-red-400'
          }`}
        />
        <span className="text-sm text-gray-300">
          {isCorrectNetwork ? 'ROKO Network' : 'Wrong Network'}
        </span>
        {!isCorrectNetwork && (
          <Button
            onClick={handleNetworkSwitch}
            size="sm"
            variant="outline"
            className="ml-2"
          >
            Switch
          </Button>
        )}
      </div>
    );
  };

  // Balance display component
  const BalanceDisplay: React.FC = () => (
    <div className="text-sm text-gray-300 space-y-1">
      {nativeBalance && (
        <div>
          {formatBalance(nativeBalance.value, nativeBalance.decimals, nativeBalance.symbol)}
        </div>
      )}
      {rokoBalance && isROKOChain(chainId) && (
        <div className="text-teal-400">
          {formatBalance(rokoBalance.value, rokoBalance.decimals, 'ROKO')}
        </div>
      )}
    </div>
  );

  // Account details modal
  const AccountModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
    isOpen,
    onClose,
  }) => {
    if (!isOpen || !address) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        <Card className="relative z-10 p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Account Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Address</label>
              <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <span className="text-white font-mono">
                  {formatAddress(address)}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(address)}
                  className="text-teal-400 hover:text-teal-300 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            {showBalance && (
              <div>
                <label className="text-sm text-gray-400">Balances</label>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <BalanceDisplay />
                </div>
              </div>
            )}

            {showNetwork && (
              <div>
                <label className="text-sm text-gray-400">Network</label>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <NetworkIndicator />
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                onClick={() =>
                  window.open(getExplorerUrl(chainId, address, 'address'), '_blank')
                }
                variant="outline"
                size="sm"
                className="flex-1"
              >
                View on Explorer
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className={className}>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Ensure mounted to prevent hydration mismatch
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      onClick={openConnectModal}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
                    >
                      Connect Wallet
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button
                      onClick={openChainModal}
                      variant="destructive"
                    >
                      Wrong Network
                    </Button>
                  );
                }

                if (variant === 'icon') {
                  return (
                    <button
                      onClick={openAccountModal}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold"
                    >
                      {account.displayName?.charAt(0) || '?'}
                    </button>
                  );
                }

                if (variant === 'compact') {
                  return (
                    <Button
                      onClick={openAccountModal}
                      variant="outline"
                      className="text-white border-teal-500 hover:bg-teal-500/10"
                    >
                      {account.displayName}
                    </Button>
                  );
                }

                return (
                  <div className="flex items-center space-x-3">
                    {showNetwork && (
                      <button
                        onClick={openChainModal}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 16,
                              height: 16,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 16, height: 16 }}
                              />
                            )}
                          </div>
                        )}
                        <span className="text-sm text-white">{chain.name}</span>
                      </button>
                    )}

                    <button
                      onClick={openAccountModal}
                      className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <div className="text-left">
                        <div className="text-sm text-white font-medium">
                          {account.displayName}
                        </div>
                        {showBalance && account.hasPendingTransactions && (
                          <div className="text-xs text-yellow-400">
                            {account.hasPendingTransactions} pending
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};

export default ConnectWallet;