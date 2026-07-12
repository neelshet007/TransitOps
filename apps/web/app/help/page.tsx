'use client';

import React, { useState } from 'react';
import { Search, Book, MessageCircle, Phone, ArrowRight, FileText, Settings, Key, Zap, Users, ExternalLink } from 'lucide-react';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredDocs = [
    { title: 'Getting Started with Dispatch', category: 'Operations', time: '5 min read', icon: Zap },
    { title: 'Managing Enterprise Roles & RBAC', category: 'Security', time: '8 min read', icon: Key },
    { title: 'Configuring Analytics Dashboards', category: 'Reporting', time: '6 min read', icon: Settings },
    { title: 'Driver Onboarding Workflows', category: 'HR', time: '4 min read', icon: Users },
  ];

  const supportChannels = [
    {
      title: 'Documentation Library',
      desc: 'Browse hundreds of detailed articles and step-by-step technical guides.',
      icon: Book,
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10',
      action: 'Browse Docs'
    },
    {
      title: 'Community Slack',
      desc: 'Connect with other fleet managers and TransitOps engineers.',
      icon: MessageCircle,
      color: 'text-accent-purple',
      bg: 'bg-accent-purple/10',
      action: 'Join Slack'
    },
    {
      title: 'Premium Support',
      desc: '24/7 dedicated enterprise support for critical dispatch operations.',
      icon: Phone,
      color: 'text-accent-green',
      bg: 'bg-accent-green/10',
      action: 'Open Ticket'
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Hero Section */}
      <div className="bg-brand-card border border-brand-border rounded-card overflow-hidden relative shadow-subtle min-h-[300px] flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#090A0F] via-[#10121a] to-[#151720]"></div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-accent-purple/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] bg-accent-blue/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-2xl text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-sm text-text-secondary max-w-lg mx-auto">
            Search our comprehensive knowledge base, API references, and operations guides to master TransitOps.
          </p>
          
          <div className="relative max-w-xl mx-auto mt-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-text-muted" size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for articles, commands, or troubleshooting..."
              className="w-full bg-[#1A1C23] border border-brand-border text-white text-sm rounded-full py-3.5 pl-12 pr-4 focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/50 transition-all shadow-inner"
              style={{ borderColor: 'var(--border-subtle)' }}
            />
            <button className="absolute inset-y-1.5 right-1.5 btn btn-primary text-xs rounded-full px-4 font-medium">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Support Channels */}
        {supportChannels.map((channel, idx) => {
          const Icon = channel.icon;
          return (
            <div 
              key={idx} 
              className="bg-brand-card border border-brand-border rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 group shadow-subtle flex flex-col justify-between"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            >
              <div>
                <div className={`p-3 ${channel.bg} ${channel.color} rounded-lg w-fit mb-5 ring-1 ring-white/5`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-accent-purple transition-colors">{channel.title}</h3>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed">{channel.desc}</p>
              </div>
              
              <button className={`mt-6 text-xs font-semibold ${channel.color} flex items-center gap-1.5 hover:gap-2 transition-all w-fit`}>
                {channel.action} <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Featured Guides Section */}
      <div className="bg-brand-card border border-brand-border rounded-xl p-8" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-divider">
          <div>
            <h3 className="text-lg font-bold text-white">Featured Technical Guides</h3>
            <p className="text-xs text-text-secondary mt-1">Recommended reading for operations teams</p>
          </div>
          <button className="btn btn-outline text-xs">View All Guides</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredDocs.map((doc, idx) => {
            const Icon = doc.icon;
            return (
              <div 
                key={idx}
                className="group flex items-start gap-4 p-4 rounded-lg bg-brand-panel border border-brand-border hover:border-accent-purple/50 transition-colors cursor-pointer"
              >
                <div className="p-2 bg-brand-card rounded border border-brand-border text-text-secondary group-hover:text-accent-purple transition-colors shrink-0">
                  <Icon size={18} />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-accent-purple mb-1 block">
                      {doc.category}
                    </span>
                    <span className="text-[10px] text-text-muted">{doc.time}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:underline decoration-white/30 underline-offset-2">
                    {doc.title}
                  </h4>
                </div>
                <div className="shrink-0 pt-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-text-secondary">
                  <ExternalLink size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
