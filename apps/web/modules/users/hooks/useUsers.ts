'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = async (userData: any) => {
    setIsLoading(true);
    try {
      const created = await userService.create(userData);
      setUsers((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, userData: any) => {
    setIsLoading(true);
    try {
      const updated = await userService.update(id, userData);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setIsLoading(true);
    try {
      await userService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refresh: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
