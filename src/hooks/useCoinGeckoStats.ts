/**
 * React hook for fetching and managing ROKO token statistics from CoinGecko
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { coingeckoService } from '../services/coingecko';
import type { TokenHolderStats } from '../services/web3';

interface UseCoinGeckoStatsOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

interface UseCoinGeckoStatsReturn {
  data: TokenHolderStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isConfigured: boolean;
}

export const useCoinGeckoStats = (options: UseCoinGeckoStatsOptions = {}): UseCoinGeckoStatsReturn => {
  const { refetchInterval = 30000, enabled = true } = options; // Default 30 seconds

  const [error, setError] = useState<string | null>(null);
  // CoinGecko is always configured (uses static JSON file)
  const isConfigured = true;

  const {
    data,
    isLoading,
    error: queryError,
    refetch: queryRefetch
  } = useQuery({
    queryKey: ['coingeckoStats', 'roko'],
    queryFn: async (): Promise<TokenHolderStats> => {
      try {
        setError(null);

        // Reload data first (in case we want to fetch fresh data in the future)
        await coingeckoService.reloadData();

        // Get data from CoinGecko service
        const price = coingeckoService.getCurrentPrice();
        const marketCap = coingeckoService.getMarketCap();
        const volume24h = coingeckoService.get24hVolume();
        const change24h = coingeckoService.get24hChange();

        // Return data in the expected format
        return {
          totalSupply: '369369369369000000000000000000', // 369,369,369,369 * 10^18 (wei format)
          totalHolders: 89432, // This would come from another source
          price: coingeckoService.getFormattedPrice('usd'),
          marketCap: coingeckoService.getFormattedMarketCap(),
          volume24h: coingeckoService.getFormatted24hVolume(),
          change24h: coingeckoService.getFormatted24hChange(),
          priceInETH: coingeckoService.getPriceInETH(),
          priceInBTC: coingeckoService.getPriceInBTC(),
          lastUpdated: coingeckoService.getLastUpdated().toISOString()
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch CoinGecko stats';
        setError(errorMessage);
        throw err;
      }
    },
    enabled: enabled && isConfigured,
    refetchInterval: refetchInterval,
    staleTime: 30000, // Consider data stale after 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
    retry: (failureCount) => {
      // Retry up to 3 times
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const refetch = useCallback(() => {
    setError(null);
    queryRefetch();
  }, [queryRefetch]);

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      const errorMessage = queryError instanceof Error
        ? queryError.message
        : 'Failed to fetch CoinGecko statistics';
      setError(errorMessage);
    }
  }, [queryError]);

  return {
    data: data || null,
    isLoading,
    error: error || (queryError?.message ?? null),
    refetch,
    isConfigured
  };
};

/**
 * Hook for getting token info from CoinGecko
 */
export const useCoinGeckoTokenInfo = () => {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['coingeckoTokenInfo', 'roko'],
    queryFn: () => {
      const tokenInfo = coingeckoService.getTokenInfo();
      return {
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        address: tokenInfo.contract_address,
        decimals: 18,
        blockchain: tokenInfo.blockchain
      };
    },
    staleTime: 3600000, // Token info rarely changes, cache for 1 hour
    gcTime: 3600000,
    retry: 2
  });

  return {
    data,
    isLoading,
    error: error?.message ?? null
  };
};

/**
 * Hook for checking if CoinGecko data is stale
 */
export const useCoinGeckoStatus = () => {
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    const checkStale = () => {
      setIsStale(coingeckoService.isDataStale());
    };

    // Check immediately
    checkStale();

    // Check every minute
    const interval = setInterval(checkStale, 60000);

    return () => clearInterval(interval);
  }, []);

  return {
    isStale,
    lastUpdated: coingeckoService.getLastUpdated()
  };
};