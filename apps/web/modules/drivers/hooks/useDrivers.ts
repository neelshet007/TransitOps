'use client';

import { useState, useEffect, useCallback } from 'react';
import { driverService } from '../services/driverService';

export function useDrivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await driverService.getAll();
      setDrivers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load drivers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDriver = async (driverData: any) => {
    setIsLoading(true);
    try {
      const created = await driverService.create(driverData);
      setDrivers((prev) => [...prev, created]);
      return created;
    } catch (err: any) {
      setError(err.message || 'Failed to create driver');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDriver = async (id: string, driverData: any) => {
    setIsLoading(true);
    try {
      const updated = await driverService.update(id, driverData);
      setDrivers((prev) => prev.map((d) => (d.id === id ? updated : d)));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update driver');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDriver = async (id: string) => {
    setIsLoading(true);
    try {
      await driverService.delete(id);
      setDrivers((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete driver');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return {
    drivers,
    isLoading,
    error,
    refresh: fetchDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
  };
}
