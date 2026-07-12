'use client';

import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService';

export function useExpenses() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await expenseService.getAll();
      setExpenses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createExpense = async (expenseData: any) => {
    setIsLoading(true);
    try {
      const created = await expenseService.create(expenseData);
      setExpenses((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message || 'Failed to create expense');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateExpense = async (id: string, expenseData: any) => {
    setIsLoading(true);
    try {
      const updated = await expenseService.update(id, expenseData);
      setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update expense');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    setIsLoading(true);
    try {
      await expenseService.delete(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete expense');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses,
    isLoading,
    error,
    refresh: fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}
