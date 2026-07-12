'use client';

import { useState, useEffect, useCallback } from 'react';
import { driverService } from '../services/driverService';
import { Driver, DriverDocument } from '@transitops/types';

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filtering state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [availability, setAvailability] = useState('all');

  // Stats for the Dashboard
  const [stats, setStats] = useState<any | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  const fetchDrivers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await driverService.getAll({
        page,
        limit,
        search,
        status,
        availability,
      });
      setDrivers(result.data);
      if (result.meta) {
        setPage(result.meta.page || 1);
        setLimit(result.meta.limit || 10);
        setTotalRecords(result.meta.total_records || 0);
        setTotalPages(result.meta.total_pages || 1);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to load drivers');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, status, availability]);

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const data = await driverService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const createDriver = async (driverData: Partial<Driver>) => {
    setIsLoading(true);
    try {
      const created = await driverService.create(driverData);
      await fetchDrivers();
      await fetchStats();
      return created;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Failed to create driver';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDriver = async (id: string, driverData: Partial<Driver>) => {
    setIsLoading(true);
    try {
      const updated = await driverService.update(id, driverData);
      await fetchDrivers();
      await fetchStats();
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Failed to update driver';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDriver = async (id: string) => {
    setIsLoading(true);
    try {
      await driverService.delete(id);
      await fetchDrivers();
      await fetchStats();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Failed to delete driver';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const restoreDriver = async (id: string) => {
    setIsLoading(true);
    try {
      const restored = await driverService.restore(id);
      await fetchDrivers();
      await fetchStats();
      return restored;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Failed to restore driver';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDriverStatus = async (id: string, newStatus: string) => {
    setIsLoading(true);
    try {
      const updated = await driverService.updateStatus(id, newStatus);
      await fetchDrivers();
      await fetchStats();
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Failed to update status';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    drivers,
    isLoading,
    error,
    refresh: fetchDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
    restoreDriver,
    updateDriverStatus,

    // Stats
    stats,
    isStatsLoading,
    refreshStats: fetchStats,

    // Pagination & Filtering API
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    totalRecords,
    search,
    setSearch,
    status,
    setStatus,
    availability,
    setAvailability,
  };
}
