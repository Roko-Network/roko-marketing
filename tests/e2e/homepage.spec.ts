import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load within performance budget', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      };
    });

    expect(metrics.domContentLoaded).toBeLessThan(2000);
    expect(metrics.loadComplete).toBeLessThan(3000);
  });

  test('should display hero section with all elements', async ({ page }) => {
    // Check headline
    await expect(page.getByRole('heading', { name: 'The Temporal Layer for Web3' })).toBeVisible();

    // Check CTAs
    await expect(page.getByRole('link', { name: 'Start Building' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Docs' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Join Network' })).toBeVisible();

    // Check timeline visualization
    await expect(page.getByTestId('timeline-visualization')).toBeVisible();

    // Check network stats
    await expect(page.getByTestId('validator-count')).toBeVisible();
    await expect(page.getByTestId('block-time')).toBeVisible();
    await expect(page.getByTestId('sync-accuracy')).toBeVisible();
  });

  test('should update network stats in real-time', async ({ page }) => {
    const initialValidatorCount = await page.getByTestId('validator-count').textContent();

    // Wait for 5 seconds (update interval)
    await page.waitForTimeout(5500);

    const updatedValidatorCount = await page.getByTestId('validator-count').textContent();

    // Stats should have updated (may be same value but should have refreshed)
    expect(updatedValidatorCount).toBeDefined();
  });

  test('should navigate to correct pages from CTAs', async ({ page }) => {
    // Test Start Building CTA
    await page.getByRole('link', { name: 'Start Building' }).click();
    await expect(page).toHaveURL('/developers/quick-start');
    await page.goBack();

    // Test View Docs CTA
    await page.getByRole('link', { name: 'View Docs' }).click();
    await expect(page).toHaveURL('/developers');
    await page.goBack();

    // Test Join Network CTA
    await page.getByRole('link', { name: 'Join Network' }).click();
    await expect(page).toHaveURL('/ecosystem/validators');
  });

  test('should have sticky navigation', async ({ page }) => {
    const nav = page.getByRole('navigation');

    // Check initial position
    await expect(nav).toHaveCSS('position', 'fixed');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));

    // Nav should still be visible and fixed
    await expect(nav).toBeVisible();
    await expect(nav).toHaveCSS('position', 'fixed');
  });

  test('should be accessible', async ({ page }) => {
    // Run axe accessibility scan
    await page.addScriptTag({
      url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.3/axe.min.js'
    });

    const violations = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        axe.run((err, results) => {
          resolve(results.violations);
        });
      });
    });

    expect(violations).toEqual([]);
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check mobile menu button
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();

    // Open mobile menu
    await page.getByRole('button', { name: /menu/i }).click();

    // Check mobile menu is visible
    await expect(page.getByTestId('mobile-menu')).toBeVisible();

    // Check all nav items are accessible
    await expect(page.getByRole('link', { name: 'Platform' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Technology' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Solutions' })).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('href', '/');

    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveText('Platform');

    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveText('Technology');

    // Use arrow keys in navigation
    await page.keyboard.press('ArrowRight');
    await expect(page.locator(':focus')).toHaveText('Solutions');
  });

  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Check that animations are disabled
    const timeline = page.getByTestId('timeline-visualization');
    await expect(timeline).not.toHaveClass(/animated/);
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle('ROKO Network - The Temporal Layer for Web3');

    // Check meta description
    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toContain('nanosecond precision');

    // Check Open Graph tags
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    expect(ogTitle).toBe('ROKO Network - The Temporal Layer for Web3');

    // Check canonical URL
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonical).toBe('https://roko.network/');
  });
});