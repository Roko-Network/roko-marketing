import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatsData {
  totalTransactions: number;
  averageLatency: number;
  clockSyncAccuracy: number;
  activeNodes: number;
  networkUptime: number;
}

interface UseNetworkStatsReturn {
  stats: NetworkStatsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Mock API function - in real implementation, this would call actual network endpoints
const fetchNetworkStats = async (): Promise<NetworkStatsData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Simulate occasional network errors
  if (Math.random() < 0.1) {
    throw new Error('Network statistics temporarily unavailable');
  }

  // Generate realistic mock data
  return {
    totalTransactions: Math.floor(Math.random() * 1000000) + 500000,
    averageLatency: Math.random() * 2 + 0.5, // 0.5-2.5ms
    clockSyncAccuracy: Math.random() * 0.0001 + 0.00005, // 50-150 nanoseconds
    activeNodes: Math.floor(Math.random() * 50) + 100, // 100-150 nodes
    networkUptime: 0.995 + Math.random() * 0.004, // 99.5-99.9% uptime
  };
};

export const useNetworkStats = (): UseNetworkStatsReturn => {
  const [stats, setStats] = useState<NetworkStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNetworkStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch network statistics');
      console.error('Network stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();

    // Set up periodic updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
};