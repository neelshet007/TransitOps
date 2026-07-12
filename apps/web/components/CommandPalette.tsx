'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Compass, Truck, Users, Settings, Wrench, Terminal } from 'lucide-react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { title: 'Go to Dashboard', path: '/dashboard', icon: Terminal },
    { title: 'Go to Vehicles Database', path: '/vehicles', icon: Truck },
    { title: 'Go to Driver Profiles', path: '/drivers', icon: Users },
    { title: 'Go to Dispatch / Trips', path: '/trips', icon: Compass },
    { title: 'Go to Maintenance Schedule', path: '/maintenance', icon: Wrench },
    { title: 'Go to System Settings', path: '/settings', icon: Settings },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase()),
  );

  const navigateTo = (path: string) => {
    router.push(path);
    setIsOpen(false);
    setSearch('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Palette body */}
      <div className="bg-brand-card border border-brand-border rounded-dialog shadow-dialog w-full max-w-lg mx-4 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-brand-divider flex items-center gap-3">
          <Search size={18} className="text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or navigate path..."
            className="w-full bg-transparent text-white text-xs outline-none border-none placeholder:text-text-muted"
            autoFocus
          />
          <span className="text-[10px] text-text-muted bg-brand-panel border border-brand-border px-1.5 py-0.5 rounded">
            ESC
          </span>
        </div>
        <div className="py-2 max-h-[300px] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-6">No matching actions found.</p>
          ) : (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.path}
                  onClick={() => navigateTo(cmd.path)}
                  className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-xs text-text-secondary hover:text-white hover:bg-brand-panel transition-colors"
                >
                  <Icon size={14} className="text-text-muted" />
                  <span>{cmd.title}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
