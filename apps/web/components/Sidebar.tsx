'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  UserCheck,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ChevronsUpDown,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [workspace, setWorkspace] = useState('Apex Atlanta (Hub)');

  const workspacesList = ['Apex Atlanta (Hub)', 'Apex Dallas (Terminal)', 'Apex Chicago (Depot)'];

  const navigation = [
    {
      group: 'Operations',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Vehicles', href: '/vehicles', icon: Truck },
        { name: 'Drivers', href: '/drivers', icon: Users },
        { name: 'Trips', href: '/trips', icon: Compass },
      ],
    },
    {
      group: 'Management',
      items: [
        { name: 'Maintenance', href: '/maintenance', icon: Wrench },
        { name: 'Fuel Logs', href: '/fuel', icon: Fuel },
        { name: 'Expenses', href: '/expenses', icon: CreditCard },
      ],
    },
    {
      group: 'System',
      items: [
        { name: 'Design System', href: '/design-system', icon: Building2 },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Users & Roles', href: '/users', icon: UserCheck },
        { name: 'Logs', href: '/logs', icon: ClipboardList },
        { name: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`flex flex-col bg-brand-sidebar border-r border-brand-border h-full transition-all duration-300 relative ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
    >
      {/* Brand logo & Workspace Switcher */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-brand-border h-[60px] overflow-hidden select-none">
        {!collapsed ? (
          <div className="relative w-full mr-2">
            <button
              onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
              className="flex items-center justify-between w-full p-1.5 bg-brand-panel hover:bg-brand-card rounded border border-brand-border text-left transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded bg-accent-purple flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  A
                </div>
                <span className="text-xs font-semibold text-white truncate">{workspace}</span>
              </div>
              <ChevronsUpDown size={12} className="text-text-muted flex-shrink-0 ml-1" />
            </button>

            {showWorkspaceDropdown && (
              <div className="absolute top-[38px] left-0 w-full bg-brand-card border border-brand-border rounded shadow-dialog py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {workspacesList.map((ws) => (
                  <button
                    key={ws}
                    onClick={() => {
                      setWorkspace(ws);
                      setShowWorkspaceDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-text-secondary hover:text-white hover:bg-brand-panel transition-colors"
                  >
                    <Building2 size={12} className="text-text-muted" />
                    <span className="truncate">{ws}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto w-8 h-8 rounded-lg bg-accent-purple flex items-center justify-center text-white font-bold">
            A
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-text-secondary hover:text-white focus:outline-none transition-colors hidden md:block"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigation.map((group) => (
          <div key={group.group} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                {group.group}
              </h3>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const IconComponent = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-button text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-brand-card text-white border-l-2 border-accent-purple'
                          : 'text-text-secondary hover:text-white hover:bg-brand-panel'
                      }`}
                      title={collapsed ? item.name : undefined}
                    >
                      <IconComponent size={18} className={isActive ? 'text-accent-purple' : ''} />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Footer Help */}
      <div className="p-4 border-t border-brand-border">
        <Link
          href="/help"
          className="flex items-center gap-3 px-3 py-2.5 rounded-button text-sm text-text-secondary hover:text-white transition-colors"
          title={collapsed ? 'Help Center' : undefined}
        >
          <HelpCircle size={18} />
          {!collapsed && <span>Help Center</span>}
        </Link>
      </div>
    </aside>
  );
}
