// CoinGecko price data service
import coingeckoData from '../../data/coingecko.json';

export interface CoinGeckoPriceData {
  usd: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: number | null;
  eur: number;
  eur_market_cap: number;
  eur_24h_vol: number;
  eur_24h_change: number | null;
  btc: number;
  btc_market_cap: number;
  btc_24h_vol: number;
  btc_24h_change: number | null;
  eth: number;
  eth_market_cap: number;
  eth_24h_vol: number;
  eth_24h_change: number | null;
  last_updated_at: number;
}

export interface CoinGeckoData {
  source: string;
  timestamp: string;
  token: {
    symbol: string;
    name: string;
    contract_address: string;
    blockchain: string;
  };
  price_data: {
    [address: string]: CoinGeckoPriceData;
  };
  detailed_info: any;
  extraction_metadata: {
    script_version: string;
    api_endpoint: string;
    extraction_time: string;
  };
}

class CoinGeckoService {
  private data: CoinGeckoData;
  private contractAddress: string;

  constructor() {
    this.data = coingeckoData as CoinGeckoData;
    this.contractAddress = this.data.token.contract_address.toLowerCase();
  }

  /**
   * Get current price in USD
   */
  getCurrentPrice(): number {
    const priceData = this.getPriceData();
    return priceData?.usd || 0;
  }

  /**
   * Get 24h price change percentage
   */
  get24hChange(): number | null {
    const priceData = this.getPriceData();
    return priceData?.usd_24h_change || null;
  }

  /**
   * Get 24h trading volume in USD
   */
  get24hVolume(): number {
    const priceData = this.getPriceData();
    return priceData?.usd_24h_vol || 0;
  }

  /**
   * Get market cap in USD
   */
  getMarketCap(): number {
    const priceData = this.getPriceData();
    const price = priceData?.usd || 0;
    // Calculate market cap using the new total supply
    const totalSupply = 369369369369; // 369,369,369,369
    return price * totalSupply;
  }

  /**
   * Get price in ETH
   */
  getPriceInETH(): number {
    const priceData = this.getPriceData();
    return priceData?.eth || 0;
  }

  /**
   * Get price in BTC
   */
  getPriceInBTC(): number {
    const priceData = this.getPriceData();
    return priceData?.btc || 0;
  }

  /**
   * Get formatted price display
   */
  getFormattedPrice(currency: 'usd' | 'eth' | 'btc' = 'usd'): string {
    const priceData = this.getPriceData();
    if (!priceData) return '$0.00';

    switch (currency) {
      case 'usd':
        return `$${this.formatNumber(priceData.usd, 6)}`;
      case 'eth':
        return `${this.formatNumber(priceData.eth, 8)} ETH`;
      case 'btc':
        return `${this.formatNumber(priceData.btc, 8)} BTC`;
      default:
        return `$${this.formatNumber(priceData.usd, 6)}`;
    }
  }

  /**
   * Get formatted market cap
   */
  getFormattedMarketCap(): string {
    const marketCap = this.getMarketCap();
    return this.formatLargeNumber(marketCap);
  }

  /**
   * Get formatted 24h volume
   */
  getFormatted24hVolume(): string {
    const volume = this.get24hVolume();
    return this.formatLargeNumber(volume);
  }

  /**
   * Get formatted 24h change
   */
  getFormatted24hChange(): string {
    const change = this.get24hChange();
    if (change === null) return '0.00%';

    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }

  /**
   * Get last update timestamp
   */
  getLastUpdated(): Date {
    const priceData = this.getPriceData();
    if (!priceData) return new Date();
    return new Date(priceData.last_updated_at * 1000);
  }

  /**
   * Check if data is stale (older than 1 hour)
   */
  isDataStale(): boolean {
    const lastUpdated = this.getLastUpdated();
    const now = new Date();
    const hourInMs = 60 * 60 * 1000;
    return (now.getTime() - lastUpdated.getTime()) > hourInMs;
  }

  /**
   * Get all price data
   */
  getAllPriceData(): CoinGeckoPriceData | null {
    return this.getPriceData();
  }

  /**
   * Get token info
   */
  getTokenInfo() {
    return this.data.token;
  }

  // Private helper methods
  private getPriceData(): CoinGeckoPriceData | null {
    // Try different address formats
    const addresses = [
      this.contractAddress,
      this.contractAddress.toLowerCase(),
      '0x' + this.contractAddress.slice(2).toLowerCase()
    ];

    for (const address of addresses) {
      if (this.data.price_data[address]) {
        return this.data.price_data[address];
      }
    }

    return null;
  }

  private formatNumber(value: number, decimals: number = 2): string {
    if (value === 0) return '0';

    // For very small numbers
    if (value < 0.01 && value > 0) {
      return value.toFixed(decimals);
    }

    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals
    });
  }

  private formatLargeNumber(value: number): string {
    if (value === 0) return '$0';

    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absValue >= 1e9) {
      return `${sign}$${(absValue / 1e9).toFixed(2)}B`;
    } else if (absValue >= 1e6) {
      return `${sign}$${(absValue / 1e6).toFixed(2)}M`;
    } else if (absValue >= 1e3) {
      return `${sign}$${(absValue / 1e3).toFixed(2)}K`;
    } else {
      return `${sign}$${absValue.toFixed(2)}`;
    }
  }

  /**
   * Reload data (for future dynamic loading)
   * This could be expanded to fetch fresh data from an API
   */
  async reloadData(): Promise<void> {
    try {
      // In production, this would fetch from the actual CoinGecko API
      // For now, we're using the static JSON file
      // const response = await fetch('/data/coingecko.json');
      // this.data = await response.json();
      console.log('CoinGecko data reloaded');
    } catch (error) {
      console.error('Failed to reload CoinGecko data:', error);
    }
  }
}

// Export singleton instance
export const coingeckoService = new CoinGeckoService();

// Export default for convenience
export default coingeckoService;