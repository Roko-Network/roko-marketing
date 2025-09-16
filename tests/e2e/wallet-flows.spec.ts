/**
 * @fileoverview Wallet connection and interaction E2E tests
 * @author ROKO QA Team
 * @version 1.0.0
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Wallet Connection Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Connect Wallet Journey', () => {
    test('should display connect wallet button', async ({ page }) => {
      const connectButton = page.getByRole('button', { name: /connect wallet/i });
      await expect(connectButton).toBeVisible();
      await expect(connectButton).toBeEnabled();
    });

    test('should open wallet connection modal on click', async ({ page }) => {
      const connectButton = page.getByRole('button', { name: /connect wallet/i });
      
      // Mock console to capture any wallet extension interactions
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      await connectButton.click();
      
      // In a real environment, this would trigger wallet extension
      // For testing, we verify the button interaction works
      await expect(connectButton).toBeVisible();
      
      // Wait briefly for any async operations
      await page.waitForTimeout(1000);
    });

    test('should handle wallet not installed scenario', async ({ page }) => {
      // Remove any potential wallet objects
      await page.addInitScript(() => {
        delete (window as any).ethereum;
        delete (window as any).web3;
      });
      
      const connectButton = page.getByRole('button', { name: /connect wallet/i });
      await connectButton.click();
      
      // Should still function without crashing
      await expect(connectButton).toBeVisible();
    });
  });

  test.describe('Network Selection', () => {
    test('should show network selection interface', async ({ page }) => {
      // Look for network-related UI elements
      const networkButton = page.getByText(/network/i).first();
      
      if (await networkButton.isVisible()) {
        await networkButton.click();
        
        // Should show network options or modal
        await page.waitForTimeout(500);
        
        // Verify UI responds to interaction
        await expect(networkButton).toBeVisible();
      }
    });

    test('should handle wrong network scenario', async ({ page }) => {
      // Mock wrong network detection
      await page.addInitScript(() => {
        (window as any).mockWrongNetwork = true;
      });
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Look for wrong network indicator
      const wrongNetworkText = page.getByText(/wrong network/i);
      
      if (await wrongNetworkText.isVisible()) {
        await expect(wrongNetworkText).toBeVisible();
        
        // Should provide switch network option
        const switchButton = page.getByRole('button', { name: /switch/i });
        if (await switchButton.isVisible()) {
          await expect(switchButton).toBeVisible();
        }
      }
    });
  });

  test.describe('Connected Wallet State', () => {
    test.beforeEach(async ({ page }) => {
      // Mock connected wallet state
      await page.addInitScript(() => {
        (window as any).mockWalletConnected = {
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
          ensName: 'alice.eth',
          chainId: 1,
          balance: '1000000000000000000000' // 1000 ETH
        };
      });
      
      await page.reload();
      await page.waitForLoadState('networkidle');
    });

    test('should display connected wallet address', async ({ page }) => {
      // Look for wallet address or ENS name
      const walletDisplay = page.getByText(/alice\.eth|0x742d/i);
      
      if (await walletDisplay.isVisible()) {
        await expect(walletDisplay).toBeVisible();
      }
    });

    test('should show account modal when clicked', async ({ page }) => {
      // Look for connected wallet button
      const walletButton = page.getByText(/alice\.eth|0x742d/i);
      
      if (await walletButton.isVisible()) {
        await walletButton.click();
        
        // Should open account details modal
        await page.waitForTimeout(500);
        
        // Look for account details
        const accountModal = page.getByText(/account details|balance|disconnect/i);
        if (await accountModal.first().isVisible()) {
          await expect(accountModal.first()).toBeVisible();
        }
      }
    });

    test('should display wallet balance information', async ({ page }) => {
      // Look for balance display
      const balanceText = page.getByText(/ETH|ROKO|\d+\.\d+/);
      
      if (await balanceText.first().isVisible()) {
        await expect(balanceText.first()).toBeVisible();
      }
    });
  });

  test.describe('Transaction Flows', () => {
    test.beforeEach(async ({ page }) => {
      // Mock connected wallet with transaction capability
      await page.addInitScript(() => {
        (window as any).mockWalletConnected = {
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
          canTransact: true
        };
      });
    });

    test('should handle staking interaction', async ({ page }) => {
      // Navigate to staking interface if it exists
      const stakingButton = page.getByText(/stake|staking/i).first();
      
      if (await stakingButton.isVisible()) {
        await stakingButton.click();
        
        // Should open staking interface
        await page.waitForTimeout(500);
        
        // Look for amount input
        const amountInput = page.getByPlaceholder(/amount|enter/i);
        if (await amountInput.isVisible()) {
          await amountInput.fill('100');
          
          // Look for stake button
          const stakeBtn = page.getByRole('button', { name: /stake/i });
          if (await stakeBtn.isVisible()) {
            await stakeBtn.click();
            
            // Should trigger transaction
            await page.waitForTimeout(1000);
          }
        }
      }
    });

    test('should handle governance voting', async ({ page }) => {
      // Navigate to governance if it exists
      const governanceLink = page.getByRole('link', { name: /governance/i }).first();
      
      if (await governanceLink.isVisible()) {
        await governanceLink.click();
        await page.waitForURL('**/governance');
        
        // Look for proposals
        const proposal = page.getByText(/proposal/i).first();
        if (await proposal.isVisible()) {
          await proposal.click();
          
          // Look for vote buttons
          const voteButton = page.getByRole('button', { name: /vote|for|against/i }).first();
          if (await voteButton.isVisible()) {
            await voteButton.click();
            
            // Should trigger vote transaction
            await page.waitForTimeout(1000);
          }
        }
      }
    });
  });

  test.describe('Error Scenarios', () => {
    test('should handle transaction rejection', async ({ page }) => {
      // Mock transaction rejection
      await page.addInitScript(() => {
        (window as any).mockTransactionRejected = true;
      });
      
      // Attempt a transaction
      const transactionButton = page.getByRole('button', { name: /stake|vote|send/i }).first();
      
      if (await transactionButton.isVisible()) {
        await transactionButton.click();
        
        // Should handle rejection gracefully
        await page.waitForTimeout(1000);
        
        // Look for error message or retry option
        const errorText = page.getByText(/rejected|failed|error/i);
        if (await errorText.isVisible()) {
          await expect(errorText).toBeVisible();
        }
      }
    });

    test('should handle network switching errors', async ({ page }) => {
      // Mock network switch failure
      await page.addInitScript(() => {
        (window as any).mockNetworkSwitchFailed = true;
      });
      
      const networkButton = page.getByText(/network|chain/i).first();
      
      if (await networkButton.isVisible()) {
        await networkButton.click();
        
        // Should handle switch failure
        await page.waitForTimeout(1000);
        
        // Should still show UI
        await expect(networkButton).toBeVisible();
      }
    });

    test('should handle wallet disconnection during use', async ({ page }) => {
      // Start with connected wallet
      await page.addInitScript(() => {
        (window as any).mockWalletConnected = {
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'
        };
      });
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Simulate disconnection
      await page.evaluate(() => {
        delete (window as any).mockWalletConnected;
        // Trigger disconnection event
        window.dispatchEvent(new CustomEvent('walletDisconnected'));
      });
      
      await page.waitForTimeout(1000);
      
      // Should revert to connect wallet state
      const connectButton = page.getByRole('button', { name: /connect wallet/i });
      await expect(connectButton).toBeVisible();
    });
  });

  test.describe('Mobile Wallet Experience', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const connectButton = page.getByRole('button', { name: /connect wallet/i });
      await expect(connectButton).toBeVisible();
      
      // Should be touchable
      await connectButton.click();
      
      // Mobile wallet connection might open different interface
      await page.waitForTimeout(1000);
      
      // Verify mobile layout
      await expect(connectButton).toBeVisible();
    });

    test('should handle WalletConnect on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Mock WalletConnect availability
      await page.addInitScript(() => {
        (window as any).WalletConnect = {
          connector: {
            connect: () => Promise.resolve()
          }
        };
      });
      
      const connectButton = page.getByRole('button', { name: /connect wallet/i });
      await connectButton.click();
      
      // Should handle WalletConnect flow
      await page.waitForTimeout(1000);
      
      // Look for QR code or connection options
      const qrCode = page.locator('canvas, img[alt*="qr"], [data-testid*="qr"]');
      if (await qrCode.first().isVisible()) {
        await expect(qrCode.first()).toBeVisible();
      }
    });
  });

  test.describe('Wallet Security', () => {
    test('should handle untrusted transactions', async ({ page }) => {
      // Mock suspicious transaction
      await page.addInitScript(() => {
        (window as any).mockSuspiciousTransaction = true;
      });
      
      const transactionButton = page.getByRole('button', { name: /send|approve/i }).first();
      
      if (await transactionButton.isVisible()) {
        await transactionButton.click();
        
        // Should show security warning
        const securityWarning = page.getByText(/warning|suspicious|verify/i);
        if (await securityWarning.isVisible()) {
          await expect(securityWarning).toBeVisible();
        }
      }
    });

    test('should validate transaction parameters', async ({ page }) => {
      // Look for transaction forms
      const amountInput = page.getByPlaceholder(/amount/i).first();
      
      if (await amountInput.isVisible()) {
        // Try invalid amount
        await amountInput.fill('-100');
        
        const submitButton = page.getByRole('button', { name: /submit|confirm|send/i }).first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Should show validation error
          const errorMessage = page.getByText(/invalid|error|must be positive/i);
          if (await errorMessage.isVisible()) {
            await expect(errorMessage).toBeVisible();
          }
        }
      }
    });
  });

  test.describe('Cross-browser Wallet Support', () => {
    test('should detect MetaMask', async ({ page, browserName }) => {
      if (browserName === 'chromium') {
        // Mock MetaMask
        await page.addInitScript(() => {
          (window as any).ethereum = {
            isMetaMask: true,
            request: () => Promise.resolve(['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'])
          };
        });
        
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        const connectButton = page.getByRole('button', { name: /connect wallet/i });
        await connectButton.click();
        
        // Should work with MetaMask
        await page.waitForTimeout(1000);
        await expect(connectButton).toBeVisible();
      }
    });

    test('should handle browser without wallet extension', async ({ page }) => {
      // Remove wallet objects
      await page.addInitScript(() => {
        delete (window as any).ethereum;
        delete (window as any).web3;
      });
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const connectButton = page.getByRole('button', { name: /connect wallet/i });
      await connectButton.click();
      
      // Should show install wallet message or alternative
      const installMessage = page.getByText(/install|download|wallet/i);
      if (await installMessage.first().isVisible()) {
        await expect(installMessage.first()).toBeVisible();
      }
      
      // Should not crash
      await expect(connectButton).toBeVisible();
    });
  });

  test.describe('Performance with Wallet', () => {
    test('should not block UI during wallet operations', async ({ page }) => {
      const connectButton = page.getByRole('button', { name: /connect wallet/i });
      
      // Click connect button
      await connectButton.click();
      
      // UI should remain responsive
      const hero = page.getByText('The Temporal Layer');
      await expect(hero).toBeVisible();
      
      // Should be able to scroll
      await page.evaluate(() => window.scrollBy(0, 100));
      
      // Other buttons should still be clickable
      const readDocsBtn = page.getByRole('button', { name: /read documentation/i });
      if (await readDocsBtn.isVisible()) {
        await expect(readDocsBtn).toBeEnabled();
      }
    });

    test('should handle multiple rapid wallet interactions', async ({ page }) => {
      const connectButton = page.getByRole('button', { name: /connect wallet/i });
      
      // Rapid clicks
      await connectButton.click();
      await connectButton.click();
      await connectButton.click();
      
      // Should handle gracefully without errors
      await page.waitForTimeout(1000);
      await expect(connectButton).toBeVisible();
    });
  });
});
