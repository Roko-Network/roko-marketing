/**
 * Service for fetching ROKO token price data from the official API
 * API Documentation: https://roko.matric.io
 * Endpoint: https://roko.matric.io/price
 * Updates every 15 minutes
 */

export interface RokoPriceData {
  timestamp: number;
  datetime: string;
  last_updated: string;
  token: {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    total_supply: string;
    circulating_supply: string;
    treasury_holdings: string;
    treasury_percentage: string;
  };
  pricing: {
    token_eth_ratio: string;
    eth_per_token: string;
    usd_per_token: string;
    eth_price_usd: string;
    market_cap_usd: string;
    total_market_cap_usd: string;
    price_source: string;
  };
  tvl: {
    total_tvl_usd: string;
    pools_count: number;
    pools: Array<{
      address: string;
      token0: string;
      token1: string;
      roko_is_token0: boolean;
      reserves: {
        reserve0: number;
        reserve1: number;
      };
      tvl_usd: number;
      volume_24h_usd: number;
      volume_7d_usd: number;
      volume_30d_usd: number;
      volume_24h_eth: number;
      volume_7d_eth: number;
      volume_30d_eth: number;
    }>;
  };
  volume: {
    volume_24h_usd: string;
    volume_7d_usd: string;
    volume_30d_usd: string;
    volume_24h_eth: string;
    volume_7d_eth: string;
    volume_30d_eth: string;
  };
  summary: {
    status: string;
    extraction_time: string;
    data_quality: string;
  };
}

class RokoPriceService {
  private readonly apiUrl = 'https://roko.matric.io/price';
  private cachedData: RokoPriceData | null = null;
  private lastFetchTime: number = 0;
  private readonly cacheDuration = 60000; // 1 minute cache to avoid excessive API calls

  /**
   * Fetch latest price data from the API
   */
  async fetchPriceData(): Promise<RokoPriceData> {
    const now = Date.now();

    // Return cached data if it's still fresh
    if (this.cachedData && (now - this.lastFetchTime) < this.cacheDuration) {
      return this.cachedData;
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as RokoPriceData;

      // Validate the response
      if (!data.summary?.status || data.summary.status !== 'success') {
        throw new Error('Invalid API response status');
      }

      // Update cache
      this.cachedData = data;
      this.lastFetchTime = now;

      return data;
    } catch (error) {
      console.error('Failed to fetch ROKO price data:', error);

      // Return cached data if available, even if expired
      if (this.cachedData) {
        console.warn('Returning stale cached data due to API error');
        return this.cachedData;
      }

      throw error;
    }
  }

  /**
   * Get formatted price in USD
   */
  getFormattedPrice(data: RokoPriceData): string {
    const price = parseFloat(data.pricing.usd_per_token);
    if (price < 0.0001) {
      return price.toExponential(4);
    }
    return price.toFixed(6);
  }

  /**
   * Get formatted market cap
   */
  getFormattedMarketCap(data: RokoPriceData): string {
    const marketCap = parseFloat(data.pricing.market_cap_usd);
    if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    }
    if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(2)}K`;
    }
    return `$${marketCap.toFixed(2)}`;
  }

  /**
   * Get formatted 24h volume
   */
  getFormatted24hVolume(data: RokoPriceData): string {
    const volume = parseFloat(data.volume.volume_24h_usd);
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(2)}M`;
    }
    if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(2)}K`;
    }
    return `$${volume.toFixed(2)}`;
  }

  /**
   * Calculate 24h price change percentage
   * Note: This would require historical data - for now returning null
   */
  get24hChange(): string | null {
    // The API doesn't provide 24h change directly
    // This would need to be calculated from historical data
    return null;
  }

  /**
   * Get TVL (Total Value Locked)
   */
  getFormattedTVL(data: RokoPriceData): string {
    const tvl = parseFloat(data.tvl.total_tvl_usd);
    if (tvl >= 1000000) {
      return `$${(tvl / 1000000).toFixed(2)}M`;
    }
    if (tvl >= 1000) {
      return `$${(tvl / 1000).toFixed(2)}K`;
    }
    return `$${tvl.toFixed(2)}`;
  }

  /**
   * Get price in ETH
   */
  getPriceInETH(data: RokoPriceData): number {
    return parseFloat(data.pricing.eth_per_token);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cachedData = null;
    this.lastFetchTime = 0;
  }
}

// Export singleton instance
export const rokoPriceService = new RokoPriceService();