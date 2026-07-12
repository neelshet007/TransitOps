'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell flex h-screen w-screen overflow-hidden bg-brand-bg font-sans">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-content flex flex-col flex-grow overflow-y-auto h-screen">
        <Navbar />
        <main className="content-container p-8 w-full max-w-[1600px] mx-auto flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
