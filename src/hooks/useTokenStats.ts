/**
 * React hook for fetching and managing ROKO token statistics
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { etherscanService, type TokenHolderStats } from '../services/web3';

interface UseTokenStatsOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

interface UseTokenStatsReturn {
  data: TokenHolderStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isConfigured: boolean;
}

export const useTokenStats = (options: UseTokenStatsOptions = {}): UseTokenStatsReturn => {
  const { refetchInterval = 30000, enabled = true } = options; // Default 30 seconds

  const [error, setError] = useState<string | null>(null);
  const isConfigured = etherscanService.isConfigured();

  const {
    data,
    isLoading,
    error: queryError,
    refetch: queryRefetch
  } = useQuery({
    queryKey: ['tokenStats', 'roko'],
    queryFn: async (): Promise<TokenHolderStats> => {
      try {
        setError(null);
        return await etherscanService.getTokenStats();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch token stats';
        setError(errorMessage);
        throw err;
      }
    },
    enabled: enabled && isConfigured,
    refetchInterval: refetchInterval,
    staleTime: 30000, // Consider data stale after 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
    retry: (failureCount, error) => {
      // Retry up to 3 times, but not for certain errors
      if (failureCount >= 3) return false;

      // Don't retry for configuration errors
      if (error?.message?.includes('API key')) return false;

      return true;
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
        : 'Failed to fetch token statistics';
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
 * Hook for getting token info (name, symbol, etc.)
 */
export const useTokenInfo = () => {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['tokenInfo', 'roko'],
    queryFn: () => etherscanService.getTokenInfo(),
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
 * Hook for service status (useful for debugging)
 */
export const useEtherscanStatus = () => {
  return etherscanService.getStatus();
};