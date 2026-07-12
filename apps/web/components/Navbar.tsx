'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Menu,
  X,
  AlertTriangle,
  Clock,
  Wallet,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const notifications = [
  {
    id: '1',
    icon: AlertTriangle,
    iconColor: 'text-accent-amber-soft',
    bgColor: 'bg-amber-500/10',
    title: 'Route Congestion Alert',
    desc: 'NH-48 near Pune experiencing 45m delays.',
    time: '10m ago',
    unread: true,
  },
  {
    id: '2',
    icon: Clock,
    iconColor: 'text-accent-red-soft',
    bgColor: 'bg-red-500/10',
    title: 'Scheduled PM Overdue',
    desc: 'Truck MH-12-Q-1045 overdue for engine oil.',
    time: '2h ago',
    unread: true,
  },
  {
    id: '3',
    icon: Wallet,
    iconColor: 'text-accent-blue-soft',
    bgColor: 'bg-blue-500/10',
    title: 'Fastag Balance Low',
    desc: 'Wallet balance below ₹5,000 threshold.',
    time: '5h ago',
    unread: false,
  },
];

function NavbarComponent({ onMobileMenuToggle, isMobileMenuOpen }: NavbarProps) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const [showNotif,   setShowNotif]   = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setShowNotif(false);
    setShowProfile(false);
  }, [pathname]);

  const handleLogout = async () => {
    setShowProfile(false);
    await logout();
    router.replace('/login');
  };

  // Breadcrumbs
  const segments = pathname.split('/').filter(Boolean);
  const userInitials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()
    : 'SA';

  const unreadCount = notifications.filter((n) => n.unread).length;

  const dropdownVariants = {
    hidden:  { opacity: 0, y: -6, scale: 0.97 },
    visible: { opacity: 1, y: 0,  scale: 1 },
  };

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 border-b border-brand-border bg-brand-panel/80 backdrop-blur-md flex-shrink-0 z-30"
      style={{ height: 58 }}
      role="banner"
    >
      {/* Left: mobile menu + breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenuToggle}
          className="btn-icon md:hidden flex-shrink-0"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-xs text-text-muted min-w-0"
        >
          <Link
            href="/dashboard"
            className="hover:text-text-primary transition-colors flex-shrink-0 font-medium"
          >
            TransitOps
          </Link>
          {segments.map((seg, idx) => {
            const href   = '/' + segments.slice(0, idx + 1).join('/');
            const isLast = idx === segments.length - 1;
            const label  = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
            return (
              <React.Fragment key={href}>
                <ChevronRight size={12} className="flex-shrink-0" />
                {isLast ? (
                  <span className="text-text-primary font-semibold truncate max-w-[160px]">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="hover:text-text-primary transition-colors truncate max-w-[120px]"
                  >
                    {label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Search trigger */}
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 'k' }))}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-border text-text-muted hover:text-text-secondary hover:border-brand-divider transition-all text-xs"
          style={{ backgroundColor: 'var(--bg-primary)' }}
          aria-label="Open command palette"
        >
          <Search size={13} />
          <span className="hidden lg:inline">Quick search...</span>
          <kbd className="text-[10px] font-semibold px-1.5 py-0.5 rounded border border-brand-border bg-brand-elevated hidden lg:inline">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotif((o) => !o); setShowProfile(false); }}
            className="btn-icon relative"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full border-2"
                style={{ borderColor: 'var(--bg-panel)' }}
                aria-hidden="true"
              />
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.15 }}
                className="dropdown-menu absolute right-0 mt-2 w-80"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                  <span className="text-sm font-semibold text-text-primary">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="badge badge-purple">{unreadCount} new</span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-brand-border">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-brand-elevated transition-colors cursor-pointer ${n.unread ? 'bg-brand-elevated/40' : ''}`}
                      >
                        <div className={`p-1.5 rounded-lg ${n.bgColor} flex-shrink-0 mt-0.5`}>
                          <Icon size={13} className={n.iconColor} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-text-primary leading-tight">
                              {n.title}
                            </p>
                            <span className="text-2xs text-text-muted flex-shrink-0 mt-0.5">{n.time}</span>
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5 leading-snug">{n.desc}</p>
                        </div>
                        {n.unread && (
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-purple-mid flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="px-4 py-2 border-t border-brand-border">
                  <button className="w-full text-center text-xs text-accent-purple-mid hover:text-accent-purple-soft transition-colors py-1">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative ml-1">
          <button
            onClick={() => { setShowProfile((o) => !o); setShowNotif(false); }}
            className="flex items-center gap-2 rounded-lg hover:bg-brand-elevated transition-colors px-1.5 py-1"
            aria-label="Open profile menu"
            aria-expanded={showProfile}
          >
            <div
              className="w-7 h-7 rounded-full border border-brand-border flex items-center justify-center text-xs font-bold text-accent-purple-soft bg-accent-purple/10"
              aria-hidden="true"
            >
              {userInitials}
            </div>
            <span className="text-xs font-medium text-text-secondary hidden lg:block max-w-[100px] truncate">
              {user ? `${user.first_name}` : 'Admin'}
            </span>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.15 }}
                className="dropdown-menu absolute right-0 mt-2 w-52"
              >
                <div className="px-4 py-3 border-b border-brand-border">
                  <p className="text-sm font-semibold text-text-primary">
                    {user ? `${user.first_name} ${user.last_name}` : 'System Admin'}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5 truncate">
                    {user?.email ?? 'admin@transitops.com'}
                  </p>
                </div>
                <div className="py-1">
                  <Link href="/profile" className="dropdown-item" onClick={() => setShowProfile(false)}>
                    <User size={14} /> My Profile
                  </Link>
                  <Link href="/settings" className="dropdown-item" onClick={() => setShowProfile(false)}>
                    <Settings size={14} /> Settings
                  </Link>
                  <Link href="/logs" className="dropdown-item" onClick={() => setShowProfile(false)}>
                    <Shield size={14} /> Security Logs
                  </Link>
                </div>
                <div className="border-t border-brand-border py-1">
                  <button onClick={handleLogout} className="dropdown-item danger w-full">
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default memo(NavbarComponent);
