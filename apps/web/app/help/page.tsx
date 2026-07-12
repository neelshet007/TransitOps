'use client';

import React from 'react';
import { HelpCircle, BookOpen, MessageSquare, PhoneCall } from 'lucide-react';

export default function HelpCenterPage() {
  const categories = [
    {
      title: 'Operations Guides',
      desc: 'Read documentation on scheduling trips, maintenance logs, and fuel tracking.',
      icon: BookOpen,
    },
    {
      title: 'Community Support',
      desc: 'Join TransitOps community channels and resolve operational workflows.',
      icon: MessageSquare,
    },
    {
      title: 'Contact Support',
      desc: 'Submit a ticket or call system operators for immediate dispatch help.',
      icon: PhoneCall,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Help Center</h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Find documentation manuals, search tutorials, or submit a support ticket
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => {
          const IconComponent = cat.icon;
          return (
            <div
              key={idx}
              className="bg-brand-card border border-brand-border rounded-card p-6 shadow-subtle flex flex-col justify-between select-none"
            >
              <div>
                <div className="p-3 bg-brand-panel border border-brand-border rounded text-accent-purple w-fit">
                  <IconComponent size={20} />
                </div>
                <h4 className="text-sm font-semibold text-white mt-4">{cat.title}</h4>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed">{cat.desc}</p>
              </div>
              <button className="btn btn-outline text-xs mt-6 w-full">Open Channel</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
