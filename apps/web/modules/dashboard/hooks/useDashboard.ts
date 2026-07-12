'use client';

import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

export function useDashboard() {
  const [stats, setStats] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logActivity = async (action: string, details: string) => {
    try {
      await dashboardService.logActivity({ action, details });
      await fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refresh: fetchStats,
    logActivity,
  };
}
