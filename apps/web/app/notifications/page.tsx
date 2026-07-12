'use client';

import React, { useState } from 'react';
import { Bell, Check, Trash2, AlertTriangle, ShieldAlert, Truck, DollarSign, Settings } from 'lucide-react';

interface AppNotification {
  id: string;
  type: 'system' | 'maintenance' | 'finance' | 'dispatch';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'maintenance',
    title: 'Odometer Threshold Reached',
    message: 'Vehicle MH-12-Q-4521 has crossed 80,000 km. Schedule preventive maintenance for brake inspection.',
    time: '12 mins ago',
    read: false,
    priority: 'high',
  },
  {
    id: 'notif-2',
    type: 'dispatch',
    title: 'Trip Delayed - Route #419',
    message: 'Driver Amit Patel reported a 2-hour delay due to heavy traffic on Mumbai-Pune Expressway.',
    time: '1 hour ago',
    read: false,
    priority: 'medium',
  },
  {
    id: 'notif-3',
    type: 'finance',
    title: 'Fastag Auto-Recharge Successful',
    message: '₹25,000 was successfully added to the corporate Fastag wallet. Current balance: ₹42,500.',
    time: '3 hours ago',
    read: true,
    priority: 'low',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'System Update Scheduled',
    message: 'TransitOps v2.4 deployment is scheduled for Sunday 02:00 AM IST. Expect 15 mins of downtime.',
    time: '5 hours ago',
    read: true,
    priority: 'medium',
  },
  {
    id: 'notif-5',
    type: 'maintenance',
    title: 'Service Completed',
    message: 'Oil change and alignment for DL-01-A-8962 is marked as completed by workshop #4.',
    time: '1 day ago',
    read: true,
    priority: 'low',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread' && n.read) return false;
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  const getIcon = (type: string, priority: string) => {
    switch (type) {
      case 'maintenance': return <AlertTriangle size={18} className="text-accent-amber" />;
      case 'finance': return <DollarSign size={18} className="text-accent-green" />;
      case 'dispatch': return <Truck size={18} className="text-accent-blue" />;
      case 'system': return <Settings size={18} className="text-text-secondary" />;
      default: return <Bell size={18} className="text-text-secondary" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Notification Center
            {unreadCount > 0 && (
              <span className="bg-accent-red text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {unreadCount} New
              </span>
            )}
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage system alerts, operational triggers, and automated updates
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="btn btn-outline text-xs flex items-center gap-2 disabled:opacity-50"
          >
            <Check size={14} /> Mark all read
          </button>
        </div>
      </div>

      <div className="bg-brand-card border border-brand-border rounded-card shadow-subtle min-h-[500px] flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-brand-divider flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-1 border-b-2 transition-all ${
                activeTab === 'all' 
                  ? 'border-accent-purple text-white' 
                  : 'border-transparent text-text-secondary hover:text-white'
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`pb-1 border-b-2 transition-all ${
                activeTab === 'unread' 
                  ? 'border-accent-purple text-white' 
                  : 'border-transparent text-text-secondary hover:text-white'
              }`}
            >
              Unread
            </button>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field text-xs bg-brand-panel max-w-[200px]"
          >
            <option value="all">All Categories</option>
            <option value="dispatch">Dispatch & Routing</option>
            <option value="maintenance">Maintenance</option>
            <option value="finance">Finance</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Notifications List */}
        <div className="flex-grow">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="p-4 bg-brand-panel rounded-full text-text-muted mb-4">
                <Bell size={32} />
              </div>
              <h3 className="text-sm font-semibold text-white">You're all caught up!</h3>
              <p className="text-xs text-text-secondary mt-1">No notifications match your current filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-brand-divider">
              {filteredNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-5 flex gap-4 transition-colors ${
                    notif.read ? 'bg-transparent' : 'bg-brand-panel/30 hover:bg-brand-panel/50'
                  }`}
                >
                  {/* Icon */}
                  <div className={`mt-1 flex-shrink-0 p-2 rounded-full border ${
                    notif.read ? 'bg-brand-panel border-brand-border' : 'bg-brand-card border-brand-border'
                  }`}>
                    {getIcon(notif.type, notif.priority)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-semibold ${notif.read ? 'text-text-secondary' : 'text-white'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-text-muted">{notif.time}</span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${notif.read ? 'text-text-muted' : 'text-text-secondary'}`}>
                      {notif.message}
                    </p>
                    
                    {/* Action buttons (only if unread) */}
                    {!notif.read && (
                      <div className="mt-3 flex items-center gap-3">
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          className="text-[11px] font-medium text-accent-blue hover:underline"
                        >
                          Mark as read
                        </button>
                        <span className="text-brand-divider">•</span>
                        <button className="text-[11px] font-medium text-text-secondary hover:text-white transition-colors">
                          View details
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Delete Action */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1.5 text-text-muted hover:text-accent-red hover:bg-brand-panel rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
