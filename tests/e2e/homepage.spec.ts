/**
 * @fileoverview Homepage E2E tests for critical user journeys
 * @author ROKO QA Team
 * @version 1.0.0
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Homepage - Critical User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test.describe('Initial Page Load', () => {
    test('should load homepage without errors', async ({ page }) => {
      // Check that the page title is correct
      await expect(page).toHaveTitle(/ROKO Network/);
      
      // Verify hero section is visible
      const heroSection = page.getByRole('region', { name: /hero section/i });
      await expect(heroSection).toBeVisible();
      
      // Check main headline
      await expect(page.getByText('The Temporal Layer')).toBeVisible();
      await expect(page.getByText('for Web3')).toBeVisible();
    });

    test('should display key value propositions', async ({ page }) => {
      // Check nanosecond precision messaging
      await expect(page.getByText(/nanosecond precision/i)).toBeVisible();
      
      // Check IEEE 1588 PTP reference
      await expect(page.getByText(/IEEE 1588 PTP/i)).toBeVisible();
      
      // Check network statistics
      await expect(page.getByText('~1ns')).toBeVisible();
      await expect(page.getByText('Precision')).toBeVisible();
      await expect(page.getByText('24/7')).toBeVisible();
      await expect(page.getByText('Uptime')).toBeVisible();
      await expect(page.getByText('Global')).toBeVisible();
      await expect(page.getByText('Network')).toBeVisible();
    });

    test('should render CTA buttons correctly', async ({ page }) => {
      const startBuildingBtn = page.getByRole('button', { name: /start building/i });
      const readDocsBtn = page.getByRole('button', { name: /read documentation/i });
      
      await expect(startBuildingBtn).toBeVisible();
      await expect(readDocsBtn).toBeVisible();
      
      // Check buttons are clickable
      await expect(startBuildingBtn).toBeEnabled();
      await expect(readDocsBtn).toBeEnabled();
    });

    test('should load 3D scene or show fallback', async ({ page }) => {
      // Wait for either 3D canvas or accessibility fallback
      const canvas = page.locator('canvas');
      const fallback = page.getByTestId('accessibility-fallback');
      
      // Should have either 3D canvas or fallback visible
      const has3D = await canvas.isVisible().catch(() => false);
      const hasFallback = await fallback.isVisible().catch(() => false);
      
      expect(has3D || hasFallback).toBe(true);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to key sections via scroll indicator', async ({ page }) => {
      const scrollIndicator = page.getByText('Explore Features');
      await expect(scrollIndicator).toBeVisible();
      
      // Click scroll indicator
      await scrollIndicator.click();
      
      // Should scroll down (check if hero is no longer in viewport)
      await page.waitForTimeout(1000); // Wait for scroll animation
      
      // Verify we've scrolled by checking if features section is visible
      const featuresSection = page.locator('[data-testid="features"]').first();
      if (await featuresSection.isVisible().catch(() => false)) {
        await expect(featuresSection).toBeInViewport();
      }
    });

    test('should navigate through main menu', async ({ page }) => {
      // Check main navigation
      const governanceLink = page.getByRole('link', { name: /governance/i }).first();
      const developersLink = page.getByRole('link', { name: /developers/i }).first();
      
      if (await governanceLink.isVisible()) {
        await governanceLink.click();
        await page.waitForURL('**/governance');
        await expect(page).toHaveURL(/governance/);
      }
      
      // Navigate back to home
      await page.goto('/');
      
      if (await developersLink.isVisible()) {
        await developersLink.click();
        await page.waitForURL('**/developers');
        await expect(page).toHaveURL(/developers/);
      }
    });
  });


  test.describe('Interactive Elements', () => {
    test('should handle CTA button interactions', async ({ page }) => {
      const startBuildingBtn = page.getByRole('button', { name: /start building/i });
      const readDocsBtn = page.getByRole('button', { name: /read documentation/i });
      
      // Test Start Building button
      await startBuildingBtn.click();
      // Should navigate or show appropriate response
      
      // Test Read Documentation button  
      await readDocsBtn.click();
      // Should navigate to docs or show modal
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      
      // Should focus on first interactive element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeFocused();
      
      // Continue tabbing
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should be able to activate with Enter
      await page.keyboard.press('Enter');
    });

    test('should show hover effects on interactive elements', async ({ page }) => {
      const startBuildingBtn = page.getByRole('button', { name: /start building/i });
      
      // Hover over button
      await startBuildingBtn.hover();
      
      // Verify hover state (button should remain visible and styled)
      await expect(startBuildingBtn).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Reload to ensure responsive styles apply
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check hero section is still visible
      await expect(page.getByText('The Temporal Layer')).toBeVisible();
      
      // Check CTA buttons are stacked on mobile
      const startBuildingBtn = page.getByRole('button', { name: /start building/i });
      const readDocsBtn = page.getByRole('button', { name: /read documentation/i });
      
      await expect(startBuildingBtn).toBeVisible();
      await expect(readDocsBtn).toBeVisible();
      
      // Verify mobile menu if present
      const mobileMenuButton = page.getByRole('button', { name: /menu/i });
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        
        // Should open mobile navigation
        await page.waitForTimeout(500);
      }
    });

    test('should display correctly on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check layout adapts to tablet
      await expect(page.getByText('The Temporal Layer')).toBeVisible();
      
      // Statistics should be visible
      await expect(page.getByText('~1ns')).toBeVisible();
      await expect(page.getByText('24/7')).toBeVisible();
      await expect(page.getByText('Global')).toBeVisible();
    });

    test('should display correctly on desktop viewport', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // All elements should be visible and properly spaced
      await expect(page.getByText('The Temporal Layer')).toBeVisible();
      await expect(page.getByText('for Web3')).toBeVisible();
      
      // Desktop navigation should be visible
      const navigation = page.getByRole('navigation').first();
      if (await navigation.isVisible()) {
        await expect(navigation).toBeVisible();
      }
    });
  });

  test.describe('Performance', () => {
    test('should load within performance budget', async ({ page }) => {
      // Measure Core Web Vitals
      const performanceEntries = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            resolve(entries.map(entry => ({
              name: entry.name,
              entryType: entry.entryType,
              startTime: entry.startTime,
              duration: entry.duration
            })));
          }).observe({ entryTypes: ['navigation', 'measure', 'paint'] });
          
          // Fallback timeout
          setTimeout(() => resolve([]), 5000);
        });
      });
      
      // Basic performance check - page should load reasonably fast
      const navigationEntry = await page.evaluate(() => {
        return performance.getEntriesByType('navigation')[0];
      }) as PerformanceNavigationTiming;
      
      if (navigationEntry) {
        // DOM Content Loaded should be under 3 seconds
        expect(navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart).toBeLessThan(3000);
        
        // Load event should be under 5 seconds
        expect(navigationEntry.loadEventEnd - navigationEntry.fetchStart).toBeLessThan(5000);
      }
    });

    test('should not have console errors', async ({ page }) => {
      const consoleErrors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Reload to capture any console errors
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Filter out known non-critical errors
      const criticalErrors = consoleErrors.filter(error => 
        !error.includes('WebGL') && 
        !error.includes('404') &&
        !error.toLowerCase().includes('warning')
      );
      
      expect(criticalErrors).toHaveLength(0);
    });

    test('should load images efficiently', async ({ page }) => {
      // Check for image loading
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        // Wait for images to load
        await page.waitForTimeout(2000);
        
        // Check that images have loaded
        for (let i = 0; i < Math.min(imageCount, 5); i++) {
          const img = images.nth(i);
          if (await img.isVisible()) {
            await expect(img).toHaveAttribute('src');
          }
        }
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading structure', async ({ page }) => {
      // Check for h1
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      
      // Should have descriptive text
      const h1Text = await h1.textContent();
      expect(h1Text).toBeTruthy();
      expect(h1Text!.length).toBeGreaterThan(5);
    });

    test('should have accessible navigation', async ({ page }) => {
      // Check for navigation landmarks
      const navigation = page.getByRole('navigation').first();
      if (await navigation.isVisible()) {
        await expect(navigation).toBeVisible();
        
        // Navigation should have accessible name
        const ariaLabel = await navigation.getAttribute('aria-label');
        const ariaLabelledBy = await navigation.getAttribute('aria-labelledby');
        
        expect(ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    });

    test('should have accessible buttons', async ({ page }) => {
      const buttons = page.getByRole('button');
      const buttonCount = await buttons.count();
      
      // Check first few buttons have accessible names
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const accessibleName = await button.textContent() || 
                                await button.getAttribute('aria-label') ||
                                await button.getAttribute('aria-labelledby');
          
          expect(accessibleName).toBeTruthy();
        }
      }
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Start keyboard navigation
      await page.keyboard.press('Tab');
      
      let focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeFocused();
      
      // Tab through several elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        focusedElement = page.locator(':focus');
        
        // Should always have a focused element
        const isFocused = await focusedElement.count() > 0;
        expect(isFocused).toBe(true);
      }
    });

    test('should have sufficient color contrast', async ({ page }) => {
      // This is a basic check - comprehensive contrast testing would need specialized tools
      
      // Check that text is visible (basic indicator of sufficient contrast)
      const headlineText = page.getByText('The Temporal Layer');
      await expect(headlineText).toBeVisible();
      
      const bodyText = page.getByText(/nanosecond precision/i);
      await expect(bodyText).toBeVisible();
      
      // In a real implementation, you might use accessibility testing tools
      // or contrast measurement libraries
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate offline condition
      await page.context().setOffline(true);
      
      try {
        await page.reload();
        
        // Should show some indication of network error or cached content
        // The exact behavior depends on your offline strategy
        
        // Basic check: page should not be completely blank
        const bodyText = await page.textContent('body');
        expect(bodyText!.length).toBeGreaterThan(10);
        
      } finally {
        // Restore network
        await page.context().setOffline(false);
      }
    });

    test('should handle JavaScript errors gracefully', async ({ page }) => {
      let jsErrors: string[] = [];
      
      page.on('pageerror', error => {
        jsErrors.push(error.message);
      });
      
      // Force a potential error scenario
      await page.evaluate(() => {
        // Try to access a potentially undefined property
        try {
          (window as any).potentiallyUndefined.someProperty;
        } catch (e) {
          // Silently handle - this is expected
        }
      });
      
      // Page should still be functional despite potential errors
      await expect(page.getByText('The Temporal Layer')).toBeVisible();
      
      // No uncaught JavaScript errors should crash the page
      const criticalJSErrors = jsErrors.filter(error => 
        !error.includes('WebGL') && 
        !error.includes('non-critical')
      );
      
      expect(criticalJSErrors).toHaveLength(0);
    });
  });

  test.describe('Browser Compatibility', () => {
    test('should work in Chrome', async ({ page, browserName }) => {
      if (browserName === 'chromium') {
        await expect(page.getByText('The Temporal Layer')).toBeVisible();
        
        // Chrome-specific checks
        const hasWebGL = await page.evaluate(() => {
          const canvas = document.createElement('canvas');
          return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        });
        
        // Chrome should support WebGL
        expect(hasWebGL).toBe(true);
      }
    });

    test('should work in Firefox', async ({ page, browserName }) => {
      if (browserName === 'firefox') {
        await expect(page.getByText('The Temporal Layer')).toBeVisible();
        
        // Firefox-specific checks
        const supportsCSSGrid = await page.evaluate(() => {
          return CSS.supports('display', 'grid');
        });
        
        expect(supportsCSSGrid).toBe(true);
      }
    });

    test('should work in Safari', async ({ page, browserName }) => {
      if (browserName === 'webkit') {
        await expect(page.getByText('The Temporal Layer')).toBeVisible();
        
        // Safari-specific checks
        const supportsModernCSS = await page.evaluate(() => {
          return CSS.supports('gap', '1rem');
        });
        
        expect(supportsModernCSS).toBe(true);
      }
    });
  });
});
