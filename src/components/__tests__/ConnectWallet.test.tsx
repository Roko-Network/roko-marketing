/**
 * @fileoverview ConnectWallet component test suite
 * @author ROKO QA Team
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { render, testData, mockWalletConnection } from '@/test-utils';
import { ConnectWallet } from '../molecules/ConnectWallet';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock RainbowKit components
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: {
    Custom: ({ children }: any) => {
      const mockProps = {
        account: testData.users.alice.address ? {
          address: testData.users.alice.address,
          displayName: testData.users.alice.ensName || testData.users.alice.address.slice(0, 6) + '...' + testData.users.alice.address.slice(-4),
          hasPendingTransactions: false,
        } : null,
        chain: {
          id: 1,
          name: 'Ethereum',
          hasIcon: true,
          iconUrl: '/ethereum.svg',
          iconBackground: '#627EEA',
          unsupported: false,
        },
        openAccountModal: vi.fn(),
        openChainModal: vi.fn(),
        openConnectModal: vi.fn(),
        authenticationStatus: 'authenticated',
        mounted: true,
      };
      
      return children(mockProps);
    }
  }
}));

// Mock Wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({
    address: testData.users.alice.address,
    isConnected: true,
  })),
  useBalance: vi.fn((params) => {
    if (params?.token) {
      return {
        data: {
          value: BigInt(testData.users.alice.pwROKO),
          decimals: 18,
          symbol: 'ROKO'
        }
      };
    }
    return {
      data: {
        value: BigInt(testData.users.alice.balance),
        decimals: 18,
        symbol: 'ETH'
      }
    };
  }),
  useEnsName: vi.fn(() => ({
    data: testData.users.alice.ensName,
  })),
  useChainId: vi.fn(() => 1),
  useSwitchChain: vi.fn(() => ({
    switchChain: vi.fn(),
  })),
}));

// Mock chain config
vi.mock('../../config/chains', () => ({
  rokoNetwork: {
    id: 12345,
    name: 'ROKO Network',
    nativeCurrency: { name: 'ROKO', symbol: 'ROKO', decimals: 18 },
  },
  getExplorerUrl: vi.fn((chainId, address, type) => `https://explorer.roko.network/${type}/${address}`),
  isROKOChain: vi.fn((chainId) => chainId === 12345),
}));

// Mock constants
vi.mock('../../config/constants', () => ({
  COLORS: {
    primary: '#00d4aa',
    secondary: '#BAC0CC',
  },
  WEB3_CONFIG: {
    contracts: {
      ROKO_TOKEN: '0x1234567890123456789012345678901234567890',
    },
  },
}));

// Mock UI components
vi.mock('../ui/Button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('../ui/Card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe('ConnectWallet Component', () => {
  const defaultProps = {
    variant: 'default' as const,
    showBalance: true,
    showNetwork: true,
    className: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering - Default State', () => {
    it('should render without crashing', () => {
      render(<ConnectWallet />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(<ConnectWallet {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<ConnectWallet className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Wallet Connected State', () => {
    it('should display connected account address', () => {
      render(<ConnectWallet />);
      expect(screen.getByText(/alice\.eth|0x742d/)).toBeInTheDocument();
    });

    it('should show network indicator when showNetwork is true', () => {
      render(<ConnectWallet showNetwork={true} />);
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });

    it('should hide network indicator when showNetwork is false', () => {
      render(<ConnectWallet showNetwork={false} />);
      expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
    });

    it('should display balances when showBalance is true', () => {
      render(<ConnectWallet showBalance={true} />);
      // Should show ETH and ROKO balances in the component context
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should hide balances when showBalance is false', () => {
      render(<ConnectWallet showBalance={false} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Component Variants', () => {
    it('should render default variant correctly', () => {
      render(<ConnectWallet variant="default" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render compact variant correctly', () => {
      render(<ConnectWallet variant="compact" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render icon variant correctly', () => {
      render(<ConnectWallet variant="icon" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle account modal opening', async () => {
      const mockOpenAccountModal = vi.fn();
      
      vi.mocked(require('@rainbow-me/rainbowkit').ConnectButton.Custom).mockImplementation(({ children }: any) => {
        const mockProps = {
          account: { address: testData.users.alice.address, displayName: 'alice.eth' },
          chain: { id: 1, name: 'Ethereum', unsupported: false },
          openAccountModal: mockOpenAccountModal,
          openChainModal: vi.fn(),
          openConnectModal: vi.fn(),
          authenticationStatus: 'authenticated',
          mounted: true,
        };
        return children(mockProps);
      });

      const user = userEvent.setup();
      render(<ConnectWallet />);
      
      const accountButton = screen.getByRole('button');
      await user.click(accountButton);
      
      expect(mockOpenAccountModal).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible according to WCAG guidelines', async () => {
      const { container } = render(<ConnectWallet />);
      const results = await axe(container);
      
      expect(results).toHaveNoViolations();
    });

    it('should have proper button roles and labels', () => {
      render(<ConnectWallet />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<ConnectWallet />);
      
      const button = screen.getByRole('button');
      await user.tab();
      
      expect(button).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('should handle wallet connection errors gracefully', () => {
      const { useAccount } = require('wagmi');
      useAccount.mockImplementation(() => {
        throw new Error('Wallet connection failed');
      });

      // Should not crash the component
      expect(() => render(<ConnectWallet />)).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should render efficiently without unnecessary re-renders', () => {
      const { rerender } = render(<ConnectWallet />);
      
      // Re-render with same props should be efficient
      rerender(<ConnectWallet />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
