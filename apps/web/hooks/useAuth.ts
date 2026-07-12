'use client';

import { useAuthStore } from '../store/authStore';

/**
 * Primary auth hook for components.
 * Returns the current user, auth state, and auth actions.
 */
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const clearError = useAuthStore((s) => s.clearError);

  return { user, isAuthenticated, isLoading, error, login, logout, fetchMe, clearError };
};
