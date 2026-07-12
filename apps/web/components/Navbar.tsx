'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Search,
  User,
  LogOut,
  Shield,
  HelpCircle,
  ChevronRight,
  Settings,
} from 'lucide-react';

export default function Navbar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(Boolean);

  const notifications = [
    {
      id: '1',
      title: 'Maintenance Overdue',
      desc: 'Truck #TX-8921 is 3 days overdue for service.',
      time: '10m ago',
      type: 'error',
    },
    {
      id: '2',
      title: 'High Fuel Cost Alert',
      desc: 'Driver Ronald Jenkins logged a transaction exceeding standard rate.',
      time: '2h ago',
      type: 'warning',
    },
    {
      id: '3',
      title: 'Trip Scheduled',
      desc: 'Trip #TRP-5512 successfully dispatched.',
      time: '4h ago',
      type: 'info',
    },
  ];

  return (
    <header className="top-navbar bg-brand-panel border-b border-brand-border h-[60px] flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-text-secondary select-none">
        <Link href="/dashboard" className="hover:text-white transition-colors">
          TransitOps
        </Link>
        {pathSegments.map((segment, index) => {
          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;
          const formattedName =
            segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');

          return (
            <React.Fragment key={href}>
              <ChevronRight size={12} className="text-text-muted" />
              {isLast ? (
                <span className="font-medium text-white truncate max-w-[150px]">
                  {formattedName}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-white transition-colors truncate max-w-[150px]"
                >
                  {formattedName}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-4">
        {/* Search Input Bar */}
        <div className="relative hidden md:block w-[280px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Global search operations..."
            className="w-full bg-brand-bg text-white border border-brand-border rounded-input pl-9 pr-4 py-1.5 text-xs focus:border-accent-purple outline-none transition-all placeholder:text-text-muted"
          />
        </div>

        {/* Notifications Alert Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="p-2 text-text-secondary hover:text-white hover:bg-brand-bg rounded-full transition-colors relative"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-red border-2 border-brand-panel rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-brand-card border border-brand-border rounded-card shadow-dialog overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-brand-border flex items-center justify-between">
                <span className="font-semibold text-white text-xs">Alert Notifications</span>
                <button className="text-[10px] text-accent-purple hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="divide-y divide-brand-divider max-h-[300px] overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 hover:bg-brand-panel transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-white">{notif.title}</h4>
                      <span className="text-[10px] text-text-muted whitespace-nowrap">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{notif.desc}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 bg-brand-panel text-center border-t border-brand-border">
                <Link
                  href="/notifications"
                  className="text-xs text-accent-purple hover:underline"
                  onClick={() => setShowNotifications(false)}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 hover:opacity-90 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center text-accent-purple font-semibold text-sm">
              SA
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-brand-card border border-brand-border rounded-card shadow-dialog overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-brand-border">
                <p className="text-xs font-semibold text-white">System Admin</p>
                <p className="text-[10px] text-text-muted">admin@transitops.com</p>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-text-secondary hover:text-white hover:bg-brand-panel transition-colors"
                  onClick={() => setShowProfile(false)}
                >
                  <User size={14} /> My Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-text-secondary hover:text-white hover:bg-brand-panel transition-colors"
                  onClick={() => setShowProfile(false)}
                >
                  <Settings size={14} /> System Settings
                </Link>
                <Link
                  href="/logs"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-text-secondary hover:text-white hover:bg-brand-panel transition-colors"
                  onClick={() => setShowProfile(false)}
                >
                  <Shield size={14} /> Security Logs
                </Link>
              </div>
              <div className="border-t border-brand-border py-1">
                <button
                  onClick={() => alert('Mock Logout Triggered')}
                  className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs text-accent-red hover:bg-brand-panel transition-colors"
                >
                  <LogOut size={14} /> Logout Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
