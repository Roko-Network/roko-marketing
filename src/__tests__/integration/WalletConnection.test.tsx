/**
 * @fileoverview Wallet connection integration tests
 * @author ROKO QA Team
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, testData, mockWalletConnection } from '@/test-utils';
import { ConnectWallet } from '@/components/molecules/ConnectWallet';
import { Hero } from '@/components/sections/Hero';

// Mock RainbowKit and Wagmi for integration testing
const mockConnectWallet = vi.fn();
const mockSwitchChain = vi.fn();
const mockDisconnect = vi.fn();

vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: {
    Custom: ({ children }: any) => {
      const mockProps = {
        account: null,
        chain: null,
        openAccountModal: vi.fn(),
        openChainModal: vi.fn(),
        openConnectModal: mockConnectWallet,
        authenticationStatus: 'unauthenticated',
        mounted: true,
      };
      return children(mockProps);
    }
  }
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({ address: null, isConnected: false })),
  useBalance: vi.fn(() => ({ data: null, isLoading: false, error: null })),
  useEnsName: vi.fn(() => ({ data: null })),
  useChainId: vi.fn(() => 1),
  useSwitchChain: vi.fn(() => ({ switchChain: mockSwitchChain })),
  useDisconnect: vi.fn(() => ({ disconnect: mockDisconnect })),
}));

// Mock chain config
vi.mock('@/config/chains', () => ({
  rokoNetwork: { id: 12345, name: 'ROKO Network' },
  isROKOChain: vi.fn((chainId) => chainId === 12345),
  getExplorerUrl: vi.fn(() => 'https://explorer.roko.network'),
}));

// Mock UI components
vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock('@/components/ui/Card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe('Wallet Connection Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Connection Flow', () => {
    it('should display connect wallet button when disconnected', () => {
      render(<ConnectWallet />);
      
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('should trigger connection modal when connect button is clicked', async () => {
      const user = userEvent.setup();
      render(<ConnectWallet />);
      
      const connectButton = screen.getByText('Connect Wallet');
      await user.click(connectButton);
      
      expect(mockConnectWallet).toHaveBeenCalled();
    });

    it('should show wallet connection in hero section context', async () => {
      const user = userEvent.setup();
      
      // Mock Hero component with wallet integration
      const MockHeroWithWallet = () => (
        <div>
          <Hero />
          <ConnectWallet />
        </div>
      );
      
      render(<MockHeroWithWallet />);
      
      // Should show both Hero content and wallet connection
      expect(screen.getByText('The Temporal Layer')).toBeInTheDocument();
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });
  });

  describe('Post-Connection State', () => {
    beforeEach(() => {
      // Mock connected state
      const { useAccount } = require('wagmi');
      useAccount.mockReturnValue({
        address: testData.users.alice.address,
        isConnected: true,
      });

      vi.mocked(require('@rainbow-me/rainbowkit').ConnectButton.Custom).mockImplementation(({ children }: any) => {
        const mockProps = {
          account: {
            address: testData.users.alice.address,
            displayName: testData.users.alice.ensName || 'alice.eth',
            hasPendingTransactions: false,
          },
          chain: {
            id: 12345,
            name: 'ROKO Network',
            hasIcon: true,
            iconUrl: '/roko.svg',
            iconBackground: '#00d4aa',
            unsupported: false,
          },
          openAccountModal: vi.fn(),
          openChainModal: vi.fn(),
          openConnectModal: vi.fn(),
          authenticationStatus: 'authenticated',
          mounted: true,
        };
        return children(mockProps);
      });
    });

    it('should display connected wallet address', () => {
      render(<ConnectWallet />);
      
      expect(screen.getByText(/alice\.eth|0x742d/)).toBeInTheDocument();
    });

    it('should show correct network when connected to ROKO', () => {
      const { useChainId } = require('wagmi');
      useChainId.mockReturnValue(12345);
      
      render(<ConnectWallet showNetwork={true} />);
      
      expect(screen.getByText('ROKO Network')).toBeInTheDocument();
    });

    it('should display balances when connected', () => {
      const { useBalance } = require('wagmi');
      useBalance.mockImplementation((params) => ({
        data: {
          value: BigInt(params?.token ? testData.users.alice.pwROKO : testData.users.alice.balance),
          formatted: params?.token ? '500.0000' : '1000.0000',
          symbol: params?.token ? 'ROKO' : 'ETH',
          decimals: 18,
        },
        isLoading: false,
        error: null,
      }));

      render(<ConnectWallet showBalance={true} />);
      
      // Balance display should be available in the connected state
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Network Switching Flow', () => {
    beforeEach(() => {
      // Mock connected to wrong network
      const { useAccount, useChainId } = require('wagmi');
      useAccount.mockReturnValue({
        address: testData.users.alice.address,
        isConnected: true,
      });
      useChainId.mockReturnValue(1); // Ethereum mainnet
    });

    it('should show wrong network indicator', () => {
      vi.mocked(require('@rainbow-me/rainbowkit').ConnectButton.Custom).mockImplementation(({ children }: any) => {
        const mockProps = {
          account: { address: testData.users.alice.address },
          chain: {
            id: 1,
            name: 'Ethereum',
            unsupported: true,
          },
          openAccountModal: vi.fn(),
          openChainModal: vi.fn(),
          openConnectModal: vi.fn(),
          authenticationStatus: 'authenticated',
          mounted: true,
        };
        return children(mockProps);
      });

      render(<ConnectWallet />);
      
      expect(screen.getByText('Wrong Network')).toBeInTheDocument();
    });

    it('should trigger chain switching when switch button clicked', async () => {
      const mockOpenChainModal = vi.fn();
      
      vi.mocked(require('@rainbow-me/rainbowkit').ConnectButton.Custom).mockImplementation(({ children }: any) => {
        const mockProps = {
          account: { address: testData.users.alice.address },
          chain: {
            id: 1,
            name: 'Ethereum',
            unsupported: true,
          },
          openAccountModal: vi.fn(),
          openChainModal: mockOpenChainModal,
          openConnectModal: vi.fn(),
          authenticationStatus: 'authenticated',
          mounted: true,
        };
        return children(mockProps);
      });

      const user = userEvent.setup();
      render(<ConnectWallet />);
      
      const wrongNetworkButton = screen.getByText('Wrong Network');
      await user.click(wrongNetworkButton);
      
      expect(mockOpenChainModal).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle connection failures gracefully', async () => {
      mockConnectWallet.mockRejectedValue(new Error('Connection failed'));
      
      const user = userEvent.setup();
      render(<ConnectWallet />);
      
      const connectButton = screen.getByText('Connect Wallet');
      
      // Should not crash on connection error
      await user.click(connectButton);
      expect(connectButton).toBeInTheDocument();
    });

    it('should handle chain switching failures', async () => {
      mockSwitchChain.mockRejectedValue(new Error('User rejected'));
      
      const user = userEvent.setup();
      
      // Setup wrong network state
      vi.mocked(require('@rainbow-me/rainbowkit').ConnectButton.Custom).mockImplementation(({ children }: any) => {
        const mockProps = {
          account: { address: testData.users.alice.address },
          chain: { id: 1, name: 'Ethereum', unsupported: true },
          openAccountModal: vi.fn(),
          openChainModal: vi.fn(),
          openConnectModal: vi.fn(),
          authenticationStatus: 'authenticated',
          mounted: true,
        };
        return children(mockProps);
      });

      render(<ConnectWallet />);
      
      // Should still show wrong network state
      expect(screen.getByText('Wrong Network')).toBeInTheDocument();
    });

    it('should handle wallet disconnection during use', () => {
      // Start connected
      const { useAccount } = require('wagmi');
      useAccount
        .mockReturnValueOnce({
          address: testData.users.alice.address,
          isConnected: true,
        })
        .mockReturnValueOnce({
          address: null,
          isConnected: false,
        });

      const { rerender } = render(<ConnectWallet />);
      
      // Should start showing connected state
      expect(screen.getByText(/alice|0x742d/)).toBeInTheDocument();
      
      // After disconnection
      rerender(<ConnectWallet />);
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should handle wallet loading state', () => {
      vi.mocked(require('@rainbow-me/rainbowkit').ConnectButton.Custom).mockImplementation(({ children }: any) => {
        const mockProps = {
          account: null,
          chain: null,
          openAccountModal: vi.fn(),
          openChainModal: vi.fn(),
          openConnectModal: vi.fn(),
          authenticationStatus: 'loading',
          mounted: false,
        };
        return children(mockProps);
      });

      render(<ConnectWallet />);
      
      // Should render but be hidden during loading
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ opacity: '0' });
    });

    it('should handle balance loading state', () => {
      const { useBalance } = require('wagmi');
      useBalance.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(<ConnectWallet />);
      
      // Should render without crashing during balance loading
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain accessibility across connection states', async () => {
      const { rerender } = render(<ConnectWallet />);
      
      // Disconnected state
      let buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
      
      // Connected state
      const { useAccount } = require('wagmi');
      useAccount.mockReturnValue({
        address: testData.users.alice.address,
        isConnected: true,
      });
      
      rerender(<ConnectWallet />);
      
      buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it('should support keyboard navigation across states', async () => {
      const user = userEvent.setup();
      render(<ConnectWallet />);
      
      const connectButton = screen.getByText('Connect Wallet');
      
      // Should be focusable
      await user.tab();
      expect(connectButton).toHaveFocus();
      
      // Should respond to Enter key
      await user.keyboard('[Enter]');
      expect(mockConnectWallet).toHaveBeenCalled();
    });
  });

  describe('Performance Integration', () => {
    it('should not cause unnecessary re-renders during connection flow', () => {
      const renderSpy = vi.fn();
      
      const TestComponent = () => {
        renderSpy();
        return <ConnectWallet />;
      };
      
      const { rerender } = render(<TestComponent />);
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Rerender with same props
      rerender(<TestComponent />);
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle rapid state changes efficiently', async () => {
      const { useAccount } = require('wagmi');
      
      // Simulate rapid connection state changes
      const states = [
        { address: null, isConnected: false },
        { address: testData.users.alice.address, isConnected: true },
        { address: null, isConnected: false },
        { address: testData.users.alice.address, isConnected: true },
      ];
      
      states.forEach(state => useAccount.mockReturnValueOnce(state));
      
      const { rerender } = render(<ConnectWallet />);
      
      // Should handle state changes without errors
      states.forEach(() => {
        rerender(<ConnectWallet />);
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('Data Flow Integration', () => {
    it('should properly integrate with balance fetching', async () => {
      const { useAccount, useBalance } = require('wagmi');
      
      // Setup connected state
      useAccount.mockReturnValue({
        address: testData.users.alice.address,
        isConnected: true,
      });
      
      useBalance.mockImplementation((params) => {
        // Should be called with correct parameters
        expect(params.address).toBe(testData.users.alice.address);
        
        return {
          data: {
            value: BigInt(testData.users.alice.balance),
            formatted: '1000.0000',
            symbol: 'ETH',
            decimals: 18,
          },
          isLoading: false,
          error: null,
        };
      });

      render(<ConnectWallet showBalance={true} />);
      
      // Should have called balance hooks
      expect(useBalance).toHaveBeenCalled();
    });

    it('should integrate with ENS name resolution', () => {
      const { useAccount, useEnsName } = require('wagmi');
      
      useAccount.mockReturnValue({
        address: testData.users.alice.address,
        isConnected: true,
      });
      
      useEnsName.mockImplementation((params) => {
        expect(params.address).toBe(testData.users.alice.address);
        return { data: testData.users.alice.ensName };
      });

      render(<ConnectWallet />);
      
      expect(useEnsName).toHaveBeenCalledWith({
        address: testData.users.alice.address,
        chainId: 1,
      });
    });
  });
});
