'use client';

import { useState, useEffect, useCallback } from 'react';
import { fuelService } from '../services/fuelService';

export function useFuel() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fuelService.getAll();
      setLogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load fuel logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLog = async (logData: any) => {
    setIsLoading(true);
    try {
      const created = await fuelService.create(logData);
      setLogs((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message || 'Failed to log fuel entry');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLog = async (id: string, logData: any) => {
    setIsLoading(true);
    try {
      const updated = await fuelService.update(id, logData);
      setLogs((prev) => prev.map((f) => (f.id === id ? updated : f)));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update fuel log');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLog = async (id: string) => {
    setIsLoading(true);
    try {
      await fuelService.delete(id);
      setLogs((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete fuel log');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    isLoading,
    error,
    refresh: fetchLogs,
    createLog,
    updateLog,
    deleteLog,
  };
}
