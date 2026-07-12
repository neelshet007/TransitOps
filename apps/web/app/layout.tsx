import React from 'react';
import AppShell from '../components/AppShell';
import './globals.css';

export const metadata = {
  title: 'TransitOps - Fleet Operations ERP',
  description: 'Enterprise resource planning for fleet transport operations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-brand-bg text-white antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
