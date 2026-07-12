'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Check, Trash2, AlertTriangle, DollarSign, Truck, Settings, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/ui/PageHeader';
import { notificationService } from '../../modules/notifications/services/notificationService';

interface AppNotification {
  id:             string;
  type:           string;
  title:          string;
  message:        string;
  is_read:        boolean;
  action_url?:    string | null;
  reference_type?: string | null;
  created_at:     string;
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Warning:     { icon: AlertTriangle, color: 'text-accent-amber-soft', bg: 'bg-amber-500/10' },
  Critical:    { icon: AlertTriangle, color: 'text-accent-red-soft',   bg: 'bg-red-500/10'   },
  Success:     { icon: Check,         color: 'text-accent-green-soft', bg: 'bg-green-500/10' },
  Information: { icon: Truck,         color: 'text-accent-blue-soft',  bg: 'bg-blue-500/10'  },
  maintenance: { icon: AlertTriangle, color: 'text-accent-amber-soft', bg: 'bg-amber-500/10' },
  finance:     { icon: DollarSign,    color: 'text-accent-green-soft', bg: 'bg-green-500/10' },
  dispatch:    { icon: Truck,         color: 'text-accent-blue-soft',  bg: 'bg-blue-500/10'  },
  system:      { icon: Settings,      color: 'text-text-secondary',    bg: 'bg-brand-elevated' },
};

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function NotificationsPage() {
  const [items,      setItems]      = useState<AppNotification[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [tab,        setTab]        = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await notificationService.getAll({ limit: 50 });
      setItems(data);
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unread = items.filter((n) => !n.is_read).length;

  const visible = items.filter((n) => {
    if (tab === 'unread' && n.is_read) return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  });

  const markAll = async () => {
    try {
      await notificationService.markAllAsRead();
      setItems((p) => p.map((n) => ({ ...n, is_read: true })));
    } catch (e) { console.error(e); }
  };

  const markOne = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setItems((p) => p.map((n) => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) { console.error(e); }
  };

  const remove = async (id: string) => {
    try {
      await notificationService.delete(id);
      setItems((p) => p.filter((n) => n.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Notification Centre"
        description="System alerts, operational triggers, and automated updates"
        badge={unread > 0 && <span className="badge badge-error">{unread} new</span>}
        actions={
          <div className="flex gap-2">
            <button onClick={fetchNotifications} className="btn btn-secondary btn-sm">
              <RefreshCw size={13} /> Refresh
            </button>
            <button onClick={markAll} disabled={unread === 0} className="btn btn-secondary btn-sm">
              <Check size={13} /> Mark all read
            </button>
          </div>
        }
      />

      <div className="card overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-b border-brand-border">
          <div className="flex items-center gap-1" role="tablist">
            {(['all', 'unread'] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`filter-tab ${tab === t ? 'active' : ''} capitalize`}
              >
                {t === 'unread' ? `Unread (${unread})` : 'All'}
              </button>
            ))}
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field w-auto text-xs">
            <option value="all">All Types</option>
            <option value="Critical">Critical</option>
            <option value="Warning">Warning</option>
            <option value="Information">Information</option>
            <option value="Success">Success</option>
          </select>
        </div>

        {/* List */}
        <div className="divide-y divide-brand-border">
          {isLoading ? (
            <div className="py-16 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {visible.length === 0 ? (
                <div className="empty-state py-16">
                  <div className="empty-state-icon">
                    <Bell size={20} />
                  </div>
                  <p className="text-sm font-medium text-text-secondary">You&apos;re all caught up</p>
                  <p className="text-xs text-text-muted">No notifications match the current filter.</p>
                </div>
              ) : (
                visible.map((n) => {
                  const cfg  = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.Information;
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.18 }}
                      className={`group flex items-start gap-3.5 p-5 transition-colors ${!n.is_read ? 'bg-brand-elevated/40 hover:bg-brand-elevated/60' : 'hover:bg-brand-elevated/20'}`}
                    >
                      <div className={`p-2 rounded-xl ${cfg.bg} flex-shrink-0 mt-0.5`}>
                        <Icon size={15} className={cfg.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {!n.is_read && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 bg-accent-blue-soft" />}
                            <p className={`text-xs font-semibold leading-tight ${n.is_read ? 'text-text-secondary' : 'text-text-primary'}`}>{n.title}</p>
                          </div>
                          <span className="text-2xs text-text-muted flex-shrink-0">{timeAgo(n.created_at)}</span>
                        </div>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed">{n.message}</p>
                        {!n.is_read && (
                          <button onClick={() => markOne(n.id)} className="mt-2 text-2xs font-semibold text-accent-purple-mid hover:text-accent-purple-soft transition-colors">
                            Mark as read
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => remove(n.id)}
                        className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity hover:text-accent-red-soft flex-shrink-0"
                        aria-label="Delete notification"
                      >
                        <Trash2 size={13} />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
