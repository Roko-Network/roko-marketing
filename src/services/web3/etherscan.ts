/**
 * Etherscan API integration service for ROKO token statistics
 *
 * Token Address: 0x6f222e04f6c53cc688ffb0abe7206aac66a8ff98
 * API Documentation: https://docs.etherscan.io/etherscan-v2/api-endpoints/tokens
 */

import { TokenHolderStats, EtherscanTokenResponse, TokenStatsError, TokenInfo } from './types';

const ETHERSCAN_API_BASE = 'https://api.etherscan.io/api';
const ROKO_TOKEN_ADDRESS = import.meta.env.VITE_ROKO_TOKEN_ADDRESS || '0x6f222e04f6c53cc688ffb0abe7206aac66a8ff98';
const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

export class EtherscanService {
  private baseUrl: string;
  private apiKey: string;
  private tokenAddress: string;

  constructor() {
    this.baseUrl = ETHERSCAN_API_BASE;
    this.apiKey = API_KEY;
    this.tokenAddress = ROKO_TOKEN_ADDRESS;

    if (!this.apiKey) {
      console.warn('Etherscan API key not configured. Token stats may be limited.');
    }
  }

  /**
   * Get token total supply
   */
  async getTokenSupply(): Promise<string> {
    try {
      const params = new URLSearchParams({
        module: 'stats',
        action: 'tokensupply',
        contractaddress: this.tokenAddress,
        ...(this.apiKey && { apikey: this.apiKey })
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EtherscanTokenResponse = await response.json();

      if (data.status === '1') {
        return data.result;
      } else {
        throw new Error(data.message || 'Failed to fetch token supply');
      }
    } catch (error) {
      console.error('Error fetching token supply:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get token holder count (requires API key)
   */
  async getTokenHolderCount(): Promise<number> {
    if (!this.apiKey) {
      // Return fallback data when API key is not available
      return 0;
    }

    try {
      const params = new URLSearchParams({
        module: 'token',
        action: 'tokenholderlist',
        contractaddress: this.tokenAddress,
        page: '1',
        offset: '1',
        apikey: this.apiKey
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === '1' && Array.isArray(data.result)) {
        // Note: This is a simplified approach. For accurate holder count,
        // you'd need to paginate through all results
        return data.result.length;
      } else {
        console.warn('Token holder list not available:', data.message);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching token holder count:', error);
      return 0;
    }
  }

  /**
   * Get comprehensive token statistics
   */
  async getTokenStats(): Promise<TokenHolderStats> {
    try {
      const [totalSupply] = await Promise.allSettled([
        this.getTokenSupply(),
        this.getTokenHolderCount()
      ]);

      const stats: TokenHolderStats = {
        totalSupply: totalSupply.status === 'fulfilled' ? totalSupply.value : '0',
        totalHolders: 0, // Will be populated from holder count
        price: undefined, // Would need price oracle integration
        marketCap: undefined,
        volume24h: undefined,
        priceChange24h: undefined
      };

      // Try to get holder count if API key is available
      if (this.apiKey) {
        try {
          stats.totalHolders = await this.getTokenHolderCount();
        } catch (error) {
          console.warn('Could not fetch holder count:', error);
        }
      }

      return stats;
    } catch (error) {
      console.error('Error fetching token stats:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get token information (name, symbol, decimals)
   */
  async getTokenInfo(): Promise<TokenInfo | null> {
    try {
      // This would typically require contract ABI calls
      // For now, return static info for ROKO token
      return {
        address: this.tokenAddress,
        name: 'ROKO Network',
        symbol: 'ROKO',
        decimals: 18,
        totalSupply: await this.getTokenSupply()
      };
    } catch (error) {
      console.error('Error fetching token info:', error);
      return null;
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return Boolean(this.apiKey && this.tokenAddress);
  }

  /**
   * Get service status for debugging
   */
  getStatus() {
    return {
      hasApiKey: Boolean(this.apiKey),
      tokenAddress: this.tokenAddress,
      baseUrl: this.baseUrl
    };
  }

  private handleError(error: any): TokenStatsError {
    if (error instanceof Error) {
      return {
        code: 'ETHERSCAN_ERROR',
        message: error.message,
        details: error
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: error
    };
  }
}

// Export singleton instance
export const etherscanService = new EtherscanService();

// Export utility functions
export const formatTokenAmount = (amount: string, decimals: number = 18): string => {
  try {
    const num = BigInt(amount);
    const divisor = BigInt(10 ** decimals);
    const whole = num / divisor;
    const remainder = num % divisor;

    if (remainder === 0n) {
      return whole.toString();
    }

    // Format with appropriate decimal places
    const decimal = remainder.toString().padStart(decimals, '0');
    const trimmed = decimal.replace(/0+$/, '');

    if (trimmed === '') {
      return whole.toString();
    }

    return `${whole}.${trimmed}`;
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0';
  }
};

export const formatNumber = (num: number): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
};