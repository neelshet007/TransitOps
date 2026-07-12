'use client';

import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

export function useDashboard() {
  const [stats, setStats] = useState<any | null>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [fuelTrends, setFuelTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, trendsData, fuelData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getAnalyticsTrends('monthly'),
        dashboardService.getFuelAnalytics()
      ]);
      setStats(statsData);
      setTrends(trendsData);
      setFuelTrends(fuelData?.trends ?? []);
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
    trends,
    fuelTrends,
    isLoading,
    error,
    refresh: fetchStats,
    logActivity,
  };
}
