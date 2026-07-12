'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AppShell from './AppShell';
import CommandPalette from './CommandPalette';
import { ThemeProvider } from './ThemeProvider';
import RouteGuard from './RouteGuard';

const SHELL_EXCLUDED_ROUTES = ['/login', '/'];

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showShell = !SHELL_EXCLUDED_ROUTES.includes(pathname);

  return (
    <ThemeProvider>
      <RouteGuard>
        {showShell ? (
          <AppShell>
            {children}
            <CommandPalette />
          </AppShell>
        ) : (
          <>{children}</>
        )}
      </RouteGuard>
    </ThemeProvider>
  );
}
