'use client';

import { useState, useEffect, useCallback } from 'react';
import { tripService } from '../services/tripService';

export function useTrips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tripService.getAll();
      setTrips(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load trips');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTrip = async (tripData: any) => {
    setIsLoading(true);
    try {
      const created = await tripService.create(tripData);
      setTrips((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message || 'Failed to create trip');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrip = async (id: string, tripData: any) => {
    setIsLoading(true);
    try {
      const updated = await tripService.update(id, tripData);
      setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update trip');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = async (id: string) => {
    setIsLoading(true);
    try {
      await tripService.delete(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete trip');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return {
    trips,
    isLoading,
    error,
    refresh: fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip,
  };
}
