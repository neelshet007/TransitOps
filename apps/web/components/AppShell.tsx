'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);
  const toggleMobile   = useCallback(() => setMobileOpen((o) => !o), []);
  const closeMobile    = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[39] md:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — desktop: inline; mobile: fixed overlay */}
      <div className="hidden md:flex h-full">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={toggleCollapsed}
        />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full z-40 md:hidden"
          >
            <Sidebar
              collapsed={false}
              setCollapsed={() => {}}
              isMobile
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="main-content">
        <Navbar
          onMobileMenuToggle={toggleMobile}
          isMobileMenuOpen={mobileOpen}
        />

        <div className="page-scroll-container" id="main-scroll-area">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="page-container"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
