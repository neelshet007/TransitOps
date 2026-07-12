'use client';

import React from 'react';
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
  ShieldAlert,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();

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
      className={`flex flex-col bg-brand-sidebar border-r border-brand-border h-full transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
    >
      {/* Brand logo header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-brand-border h-[60px] overflow-hidden">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-purple flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <span className="font-bold text-white text-lg tracking-tight">TransitOps</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto w-8 h-8 rounded-lg bg-accent-purple flex items-center justify-center text-white font-bold">
            T
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
