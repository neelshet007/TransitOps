'use client';

import { useState, useEffect, useCallback } from 'react';
import { maintenanceService } from '../services/maintenanceService';

export function useMaintenance() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await maintenanceService.getAll();
      setLogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load maintenance logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLog = async (logData: any) => {
    setIsLoading(true);
    try {
      const created = await maintenanceService.create(logData);
      setLogs((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message || 'Failed to create log');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLog = async (id: string, logData: any) => {
    setIsLoading(true);
    try {
      const updated = await maintenanceService.update(id, logData);
      setLogs((prev) => prev.map((m) => (m.id === id ? updated : m)));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update log');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLog = async (id: string) => {
    setIsLoading(true);
    try {
      await maintenanceService.delete(id);
      setLogs((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete log');
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
