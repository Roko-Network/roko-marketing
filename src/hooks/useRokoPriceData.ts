/**
 * React hook for fetching and managing ROKO token statistics from the official Roko price API
 */

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rokoPriceService, type RokoPriceData } from '../services/rokoPriceApi';

interface UseRokoPriceDataOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

interface TokenStats {
  // Price data
  price: string;
  priceUSD: number;
  priceETH: number;
  marketCap: string;
  totalMarketCap: string;

  // Supply data
  totalSupply: string;
  circulatingSupply: string;
  treasuryHoldings: string;
  treasuryPercentage: string;

  // Volume data
  volume24h: string;
  volume7d: string;
  volume30d: string;

  // TVL data
  tvl: string;
  poolsCount: number;

  // Meta
  lastUpdated: string;
  dataQuality: string;
}

interface UseRokoPriceDataReturn {
  data: TokenStats | null;
  rawData: RokoPriceData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useRokoPriceData = (options: UseRokoPriceDataOptions = {}): UseRokoPriceDataReturn => {
  const { refetchInterval = 60000, enabled = true } = options; // Default 60 seconds

  const {
    data: rawData,
    isLoading,
    error,
    refetch: queryRefetch
  } = useQuery({
    queryKey: ['rokoPriceData'],
    queryFn: async (): Promise<RokoPriceData> => {
      return await rokoPriceService.fetchPriceData();
    },
    enabled,
    refetchInterval,
    staleTime: 30000, // Consider data stale after 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const refetch = useCallback(() => {
    rokoPriceService.clearCache();
    queryRefetch();
  }, [queryRefetch]);

  // Transform raw data into formatted stats
  const data: TokenStats | null = rawData ? {
    // Price data
    price: rokoPriceService.getFormattedPrice(rawData),
    priceUSD: parseFloat(rawData.pricing.usd_per_token),
    priceETH: rokoPriceService.getPriceInETH(rawData),
    marketCap: rokoPriceService.getFormattedMarketCap(rawData),
    totalMarketCap: `$${parseFloat(rawData.pricing.total_market_cap_usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,

    // Supply data
    totalSupply: rawData.token.total_supply,
    circulatingSupply: rawData.token.circulating_supply,
    treasuryHoldings: rawData.token.treasury_holdings,
    treasuryPercentage: `${rawData.token.treasury_percentage}%`,

    // Volume data
    volume24h: rokoPriceService.getFormatted24hVolume(rawData),
    volume7d: `$${parseFloat(rawData.volume.volume_7d_usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    volume30d: `$${parseFloat(rawData.volume.volume_30d_usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,

    // TVL data
    tvl: rokoPriceService.getFormattedTVL(rawData),
    poolsCount: rawData.tvl.pools_count,

    // Meta
    lastUpdated: rawData.last_updated,
    dataQuality: rawData.summary.data_quality
  } : null;

  return {
    data,
    rawData: rawData ?? null,
    isLoading,
    error: error?.message ?? null,
    refetch
  };
};

/**
 * Hook for getting token info from the Roko API
 */
export const useRokoTokenInfo = () => {
  const { rawData, isLoading, error } = useRokoPriceData({
    refetchInterval: 3600000 // Token info rarely changes, refetch every hour
  });

  return {
    data: rawData ? {
      name: rawData.token.name,
      symbol: rawData.token.symbol,
      address: rawData.token.address,
      decimals: rawData.token.decimals,
      totalSupply: rawData.token.total_supply,
      circulatingSupply: rawData.token.circulating_supply
    } : null,
    isLoading,
    error
  };
};