'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Truck,
  Users,
  Compass,
  Wrench,
  Fuel,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Building2,
  Zap,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    group: 'Operations',
    items: [
      { name: 'Dashboard',  href: '/dashboard',    icon: LayoutDashboard },
      { name: 'Vehicles',   href: '/vehicles',     icon: Truck },
      { name: 'Drivers',    href: '/drivers',      icon: Users },
      { name: 'Trips',      href: '/trips',        icon: Compass },
    ],
  },
  {
    group: 'Management',
    items: [
      { name: 'Maintenance', href: '/maintenance', icon: Wrench },
      { name: 'Fuel Logs',   href: '/fuel',        icon: Fuel },
      { name: 'Expenses',    href: '/expenses',    icon: CreditCard },
    ],
  },
  {
    group: 'System',
    items: [
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Reports',   href: '/reports',   icon: FileText },
      { name: 'Settings',  href: '/settings',  icon: Settings },
    ],
  },
];

const workspaces = [
  'VRL Logistics (Mumbai)',
  'SafeExpress (Delhi)',
  'TCI Freight (Bengaluru)',
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  isMobile?: boolean;
}

function SidebarComponent({ collapsed, setCollapsed, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const [workspace, setWorkspace] = useState(workspaces[0]);
  const [wsDropOpen, setWsDropOpen] = useState(false);

  const sidebarWidth = collapsed && !isMobile ? 64 : 256;

  return (
    <motion.aside
      animate={{ width: sidebarWidth }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="sidebar flex-shrink-0"
      style={{ width: sidebarWidth }}
    >
      {/* ── Brand / Workspace Switcher ──────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-3 border-b border-brand-border"
        style={{ height: 58 }}
      >
        <AnimatePresence mode="wait">
          {(!collapsed || isMobile) ? (
            <motion.div
              key="workspace-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative flex-1 min-w-0 mr-2"
            >
              <button
                onClick={() => setWsDropOpen((o) => !o)}
                className="flex items-center justify-between w-full gap-2 px-2 py-1.5 rounded-lg hover:bg-brand-elevated transition-colors text-left"
                aria-label="Switch workspace"
                aria-expanded={wsDropOpen}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-accent-purple flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    V
                  </div>
                  <span className="text-xs font-semibold text-text-primary truncate">
                    {workspace}
                  </span>
                </div>
                <ChevronsUpDown size={13} className="text-text-muted flex-shrink-0" />
              </button>

              <AnimatePresence>
                {wsDropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="dropdown-menu absolute top-full left-0 right-0 mt-1"
                  >
                    {workspaces.map((ws) => (
                      <button
                        key={ws}
                        onClick={() => {
                          setWorkspace(ws);
                          setWsDropOpen(false);
                        }}
                        className="dropdown-item w-full text-left gap-2 py-2"
                      >
                        <Building2 size={12} className="text-text-muted flex-shrink-0" />
                        <span className="text-xs truncate">{ws}</span>
                        {ws === workspace && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-purple-mid flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="workspace-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mx-auto"
            >
              <div className="w-8 h-8 rounded-lg bg-accent-purple flex items-center justify-center text-white font-bold text-sm">
                V
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn-icon flex-shrink-0 hidden md:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-3 space-y-5"
        aria-label="Main navigation"
      >
        {navigation.map((group) => (
          <div key={group.group}>
            <AnimatePresence>
              {(!collapsed || isMobile) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="label-xs px-2 mb-1.5"
                >
                  {group.group}
                </motion.p>
              )}
            </AnimatePresence>

            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`nav-item ${isActive ? 'active' : ''} ${collapsed && !isMobile ? 'justify-center px-0' : ''}`}
                      data-tooltip={collapsed && !isMobile ? item.name : undefined}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon
                        size={17}
                        className={`nav-icon flex-shrink-0 transition-colors ${isActive ? 'text-accent-purple-mid' : 'text-text-muted'}`}
                      />
                      <AnimatePresence>
                        {(!collapsed || isMobile) && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden whitespace-nowrap text-sm"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div className="px-2.5 py-3 border-t border-brand-border">
        <Link
          href="/help"
          className={`nav-item ${collapsed && !isMobile ? 'justify-center px-0' : ''}`}
          data-tooltip={collapsed && !isMobile ? 'Help Center' : undefined}
        >
          <HelpCircle size={17} className="nav-icon text-text-muted flex-shrink-0" />
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden whitespace-nowrap text-sm"
              >
                Help Center
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.aside>
  );
}

export default memo(SidebarComponent);
