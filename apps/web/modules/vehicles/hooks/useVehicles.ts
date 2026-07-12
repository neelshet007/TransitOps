'use client';

import { useState, useEffect, useCallback } from 'react';
import { vehicleService } from '../services/vehicleService';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load vehicles');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createVehicle = async (vehicleData: any) => {
    setIsLoading(true);
    try {
      const created = await vehicleService.create(vehicleData);
      setVehicles((prev) => [...prev, created]);
      return created;
    } catch (err: any) {
      setError(err.message || 'Failed to create vehicle');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVehicle = async (id: string, vehicleData: any) => {
    setIsLoading(true);
    try {
      const updated = await vehicleService.update(id, vehicleData);
      setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update vehicle');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVehicle = async (id: string) => {
    setIsLoading(true);
    try {
      await vehicleService.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete vehicle');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    isLoading,
    error,
    refresh: fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
}
