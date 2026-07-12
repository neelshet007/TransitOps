'use client';

import { useAuthStore } from '../store/authStore';

/**
 * Returns true if the current authenticated user has the specified permission code.
 * Usage: const canCreateUser = usePermission('users:create');
 */
export const usePermission = (permissionCode: string): boolean => {
  const user = useAuthStore((s) => s.user);
  if (!user) return false;
  return user.permissions.includes(permissionCode);
};

/**
 * Returns true if the current authenticated user has ANY of the specified permission codes.
 */
export const useAnyPermission = (permissionCodes: string[]): boolean => {
  const user = useAuthStore((s) => s.user);
  if (!user) return false;
  return permissionCodes.some((code) => user.permissions.includes(code));
};

/**
 * Returns true if the current authenticated user has the specified role code.
 * Usage: const isAdmin = useRole('admin');
 */
export const useRole = (roleCode: string): boolean => {
  const user = useAuthStore((s) => s.user);
  if (!user) return false;
  return user.roles.includes(roleCode);
};
