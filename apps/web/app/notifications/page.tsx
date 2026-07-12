'use client';

import React, { useState } from 'react';
import { Bell, Check, Trash2, AlertTriangle, DollarSign, Truck, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/ui/PageHeader';

interface AppNotification {
  id:       string;
  type:     'system' | 'maintenance' | 'finance' | 'dispatch';
  title:    string;
  message:  string;
  time:     string;
  read:     boolean;
  priority: 'low' | 'medium' | 'high';
}

const INITIAL: AppNotification[] = [
  { id: 'n1', type: 'maintenance', priority: 'high',   read: false, time: '12m ago',  title: 'Odometer Threshold Reached',    message: 'Vehicle MH-12-Q-4521 has crossed 80,000 km. Schedule preventive maintenance.' },
  { id: 'n2', type: 'dispatch',    priority: 'medium', read: false, time: '1h ago',   title: 'Trip Delayed — Route #419',     message: 'Driver Amit Patel reported a 2-hour delay on Mumbai–Pune Expressway.' },
  { id: 'n3', type: 'finance',     priority: 'low',    read: true,  time: '3h ago',   title: 'Fastag Auto-Recharge Successful', message: '₹25,000 added to corporate Fastag wallet. Current balance: ₹42,500.' },
  { id: 'n4', type: 'system',      priority: 'medium', read: true,  time: '5h ago',   title: 'Maintenance Window Scheduled',  message: 'TransitOps v2.4 deployment Sunday 02:00 AM IST. Expect 15 min downtime.' },
  { id: 'n5', type: 'maintenance', priority: 'low',    read: true,  time: '1d ago',   title: 'Service Completed',             message: 'Oil change and alignment for DL-01-A-8962 marked complete by workshop #4.' },
];

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  maintenance: { icon: AlertTriangle, color: 'text-accent-amber-soft', bg: 'bg-amber-500/10' },
  finance:     { icon: DollarSign,    color: 'text-accent-green-soft', bg: 'bg-green-500/10' },
  dispatch:    { icon: Truck,         color: 'text-accent-blue-soft',  bg: 'bg-blue-500/10'  },
  system:      { icon: Settings,      color: 'text-text-secondary',    bg: 'bg-brand-elevated' },
};

const PRIORITY_DOT: Record<string, string> = {
  high:   'bg-accent-red-soft',
  medium: 'bg-accent-amber-soft',
  low:    'bg-text-disabled',
};

export default function NotificationsPage() {
  const [items,      setItems]      = useState(INITIAL);
  const [tab,        setTab]        = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const unread = items.filter((n) => !n.read).length;

  const visible = items.filter((n) => {
    if (tab === 'unread' && n.read) return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  });

  const markAll  = () => setItems((p) => p.map((n) => ({ ...n, read: true })));
  const markOne  = (id: string) => setItems((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const remove   = (id: string) => setItems((p) => p.filter((n) => n.id !== id));

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Notification Centre"
        description="System alerts, operational triggers, and automated updates"
        badge={unread > 0 && <span className="badge badge-error">{unread} new</span>}
        actions={
          <button onClick={markAll} disabled={unread === 0} className="btn btn-secondary btn-sm">
            <Check size={13} /> Mark all read
          </button>
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
            <option value="all">All Categories</option>
            <option value="dispatch">Dispatch</option>
            <option value="maintenance">Maintenance</option>
            <option value="finance">Finance</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* List */}
        <div className="divide-y divide-brand-border">
          <AnimatePresence initial={false}>
            {visible.length === 0 ? (
              <div className="empty-state py-16">
                <div className="empty-state-icon">
                  <Bell size={20} />
                </div>
                <p className="text-sm font-medium text-text-secondary">You're all caught up</p>
                <p className="text-xs text-text-muted">No notifications match the current filter.</p>
              </div>
            ) : (
              visible.map((n) => {
                const cfg  = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system;
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.18 }}
                    className={`group flex items-start gap-3.5 p-5 transition-colors ${!n.read ? 'bg-brand-elevated/40 hover:bg-brand-elevated/60' : 'hover:bg-brand-elevated/20'}`}
                  >
                    <div className={`p-2 rounded-xl ${cfg.bg} flex-shrink-0 mt-0.5`}>
                      <Icon size={15} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {!n.read && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${PRIORITY_DOT[n.priority]}`} />}
                          <p className={`text-xs font-semibold leading-tight ${n.read ? 'text-text-secondary' : 'text-text-primary'}`}>{n.title}</p>
                        </div>
                        <span className="text-2xs text-text-muted flex-shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">{n.message}</p>
                      {!n.read && (
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
        </div>
      </div>
    </div>
  );
}
