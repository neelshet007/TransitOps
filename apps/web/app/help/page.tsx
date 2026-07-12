'use client';

import React, { useState } from 'react';
import { Search, Book, MessageCircle, Phone, ArrowRight, FileText, Settings, Key, Zap, Users, ExternalLink } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';

const DOCS = [
  { title: 'Getting Started with Dispatch',        category: 'Operations', time: '5 min', icon: Zap },
  { title: 'Managing Enterprise Roles & RBAC',     category: 'Security',   time: '8 min', icon: Key },
  { title: 'Configuring Analytics Dashboards',     category: 'Reporting',  time: '6 min', icon: Settings },
  { title: 'Driver Onboarding Workflows',          category: 'HR',         time: '4 min', icon: Users },
  { title: 'Fuel Log Import & Reconciliation',     category: 'Finance',    time: '5 min', icon: FileText },
  { title: 'API Integration Guide',               category: 'Technical',  time: '10 min', icon: Settings },
];

const CHANNELS = [
  { title: 'Documentation Library', desc: 'Hundreds of detailed articles and step-by-step guides.',          icon: Book,          color: 'text-accent-blue-soft',   bg: 'bg-blue-500/10',   action: 'Browse Docs' },
  { title: 'Community Slack',       desc: 'Connect with other fleet managers and TransitOps engineers.',    icon: MessageCircle, color: 'text-accent-purple-soft', bg: 'bg-purple-500/10', action: 'Join Slack' },
  { title: 'Premium Support',       desc: '24/7 dedicated enterprise support for critical operations.',      icon: Phone,         color: 'text-accent-green-soft',  bg: 'bg-green-500/10',  action: 'Open Ticket' },
];

export default function HelpCenterPage() {
  const [query, setQuery] = useState('');

  const filtered = query
    ? DOCS.filter((d) => d.title.toLowerCase().includes(query.toLowerCase()) || d.category.toLowerCase().includes(query.toLowerCase()))
    : DOCS;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Hero */}
      <div className="card relative overflow-hidden p-10 text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-blue/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="relative space-y-5 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">How can we help?</h1>
          <p className="text-sm text-text-secondary">Search our knowledge base, API references, and operations guides.</p>
          <div className="input-with-icon max-w-lg mx-auto">
            <Search size={16} className="input-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, commands, troubleshooting…"
              className="input-field rounded-full pl-10 py-3"
            />
          </div>
        </div>
      </div>

      {/* Support channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CHANNELS.map((ch) => {
          const Icon = ch.icon;
          return (
            <div key={ch.title} className="card card-hover p-5 flex flex-col gap-4 group">
              <div className={`p-3 rounded-xl w-fit ${ch.bg}`}>
                <Icon size={20} className={ch.color} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-purple-soft transition-colors">{ch.title}</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">{ch.desc}</p>
              </div>
              <button className={`flex items-center gap-1.5 text-xs font-semibold ${ch.color} hover:gap-2.5 transition-all`}>
                {ch.action} <ArrowRight size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Guides */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-brand-border">
          <div>
            <h3 className="section-title">Featured Guides</h3>
            <p className="text-xs text-text-muted mt-0.5">Recommended reading for operations teams</p>
          </div>
          <button className="btn btn-secondary btn-sm">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((doc) => {
            const Icon = doc.icon;
            return (
              <button
                key={doc.title}
                className="group flex items-start gap-3.5 p-4 rounded-xl border border-brand-border hover:border-accent-purple/30 hover:bg-brand-elevated transition-all text-left w-full"
              >
                <div className="p-2 rounded-lg bg-brand-elevated border border-brand-border group-hover:border-accent-purple/20 flex-shrink-0">
                  <Icon size={15} className="text-text-muted group-hover:text-accent-purple-soft transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="label-xs text-accent-purple-mid">{doc.category}</span>
                    <span className="text-2xs text-text-muted">{doc.time} read</span>
                  </div>
                  <p className="text-xs font-semibold text-text-primary group-hover:text-text-primary leading-tight">{doc.title}</p>
                </div>
                <ExternalLink size={13} className="text-text-disabled group-hover:text-text-muted transition-colors flex-shrink-0 mt-1" />
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-8 text-text-muted text-xs">
              No articles found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
