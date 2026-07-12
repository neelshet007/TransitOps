import React from 'react';
import AppShell from '../components/AppShell';
import CommandPalette from '../components/CommandPalette';
import { ThemeProvider } from '../components/ThemeProvider';
import './globals.css';

export const metadata = {
  title: 'TransitOps - Fleet Operations ERP',
  description: 'Enterprise resource planning for fleet transport operations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <ThemeProvider>
          <AppShell>
            {children}
            <CommandPalette />
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
