import React from 'react';
import './globals.css';
import RootClientLayout from '../components/RootClientLayout';

export const metadata = {
  title: 'TransitOps - Fleet Operations ERP',
  description: 'Enterprise resource planning for fleet transport operations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  );
}
