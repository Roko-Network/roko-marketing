/**
 * Utility functions for formatting numbers and token amounts
 */

/**
 * Format a number with appropriate suffixes (K, M, B, T)
 */
export function formatNumber(num: number): string {
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

/**
 * Format token amount from wei to human readable format
 * @param amount - Amount in wei (or smallest unit)
 * @param decimals - Number of decimals (default 18)
 */
export function formatTokenAmount(amount: string, decimals: number = 18): string {
  try {
    // Remove any non-numeric characters except decimal point
    const cleanAmount = amount.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanAmount);

    if (isNaN(num)) return '0';

    // Convert from wei to token amount
    const tokenAmount = num / Math.pow(10, decimals);

    // Format based on size
    if (tokenAmount >= 1e9) return `${(tokenAmount / 1e9).toFixed(2)}B`;
    if (tokenAmount >= 1e6) return `${(tokenAmount / 1e6).toFixed(2)}M`;
    if (tokenAmount >= 1e3) return `${(tokenAmount / 1e3).toFixed(2)}K`;
    if (tokenAmount < 0.01) return tokenAmount.toExponential(4);

    return tokenAmount.toFixed(6);
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0';
  }
}

/**
 * Format USD amounts with proper currency notation
 */
export function formatUSD(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(num)) return '$0.00';

  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;

  return `$${num.toFixed(2)}`;
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '0%';

  return `${num.toFixed(2)}%`;
}