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
  ChevronRight,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(Boolean);

  const notifications = [
    {
      id: '1',
      title: 'Route Congestion Alert',
      desc: 'NH-48 corridor near Pune experiencing 45m delays.',
      time: '10m ago',
    },
    {
      id: '2',
      title: 'Scheduled PM Overdue',
      desc: 'Truck MH-12-Q-1045 is 2 days overdue for engine oil replacement.',
      time: '2h ago',
    },
    {
      id: '3',
      title: 'Fastag Balance Low',
      desc: 'Fastag account wallet balance below ₹5,000 threshold.',
      time: '5h ago',
    },
  ];

  return (
    <header
      className="top-navbar border-b h-[60px] flex items-center justify-between px-6 sticky top-0 z-40 select-none"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
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
        {/* Command Search button */}
        <button
          onClick={() => {
            const e = new KeyboardEvent('keydown', { ctrlKey: true, key: 'k' });
            window.dispatchEvent(e);
          }}
          className="relative hidden md:flex items-center justify-between w-[240px] text-left text-text-muted hover:text-text-secondary border rounded-input px-3 py-1.5 text-xs outline-none transition-all"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <span className="flex items-center gap-2">
            <Search size={14} />
            <span>Search dispatch...</span>
          </span>
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-text-muted border"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            Ctrl K
          </span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-text-secondary hover:text-white hover:bg-brand-bg rounded-full transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

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
            <span
              className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-red border-2 border-brand-panel rounded-full"
              style={{ borderColor: 'var(--bg-secondary)' }}
            ></span>
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-80 border rounded-card shadow-dialog overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div
                className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <span className="font-semibold text-white text-xs">Alert Notifications</span>
                <button className="text-[10px] text-accent-purple hover:underline">
                  Mark all read
                </button>
              </div>
              <div
                className="divide-y divide-brand-divider max-h-[300px] overflow-y-auto"
                style={{ dividerColor: 'var(--border-subtle)' }}
              >
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 hover:bg-brand-panel transition-colors"
                    style={{ hoverBackgroundColor: 'var(--bg-secondary)' }}
                  >
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
              <div
                className="px-4 py-2 text-center border-t"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              >
                <span className="text-xs text-accent-purple cursor-pointer hover:underline">
                  Clear all alerts
                </span>
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
            <div
              className="w-8 h-8 rounded-full border flex items-center justify-center text-accent-purple font-semibold text-sm"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              SA
            </div>
          </button>

          {showProfile && (
            <div
              className="absolute right-0 mt-2 w-56 border rounded-card shadow-dialog overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
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
              <div className="border-t py-1" style={{ borderColor: 'var(--border-subtle)' }}>
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
