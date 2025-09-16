/**
 * Web3 and Token-related type definitions
 */

export interface TokenHolderStats {
  totalSupply: string;
  totalHolders: number;
  price?: string;
  marketCap?: string;
  volume24h?: string;
  priceChange24h?: string;
}

export interface EtherscanTokenResponse {
  status: string;
  message: string;
  result: string;
}

export interface TokenStatsError {
  code: string;
  message: string;
  details?: any;
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}