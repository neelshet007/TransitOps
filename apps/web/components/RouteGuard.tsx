'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

const PUBLIC_ROUTES = ['/login'];

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    // On mount, if we have a token but no confirmed auth state, validate with the server
    const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
    if (token && !isAuthenticated) {
      fetchMe();
    }
  }, [accessToken, isAuthenticated, fetchMe]);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!mounted || isLoading) return; // Wait for mount and fetch to complete

    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/login');
    }

    if (isAuthenticated && isPublicRoute) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isPublicRoute, isLoading, router, mounted]);

  // Show a minimal loading indicator while validating token or mounting
  if (!mounted || isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#090A0F]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-text-secondary">Authenticating session...</p>
        </div>
      </div>
    );
  }

  // While unauthenticated on a protected route, render nothing (router.replace will fire)
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
