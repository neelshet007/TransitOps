'use client';

import { useState, useEffect, useCallback } from 'react';
import { roleService } from '../services/roleService';

export function useRoles() {
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await roleService.getAll();
      setRoles(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRole = async (roleData: any) => {
    setIsLoading(true);
    try {
      const created = await roleService.create(roleData);
      setRoles((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message || 'Failed to create role');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async (id: string, roleData: any) => {
    setIsLoading(true);
    try {
      const updated = await roleService.update(id, roleData);
      setRoles((prev) => prev.map((r) => (r.id === id ? updated : r)));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRole = async (id: string) => {
    setIsLoading(true);
    try {
      await roleService.delete(id);
      setRoles((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete role');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    isLoading,
    error,
    refresh: fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  };
}
