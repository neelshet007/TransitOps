'use client';

import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Info,
  Moon,
  Sun,
  Download,
  Trash,
} from 'lucide-react';

import StatCard from '../../components/StatCard';
import Modal from '../../components/Modal';
import Drawer from '../../components/Drawer';
import DataTable from '../../components/DataTable';
import { useTheme } from '../../components/ThemeProvider';

export default function DesignSystemPage() {
  const { theme, toggleTheme } = useTheme();

  // Dialog / Drawer states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Table mock database
  const templateRecords = [
    {
      id: '1',
      name: 'Standard Item Alpha',
      type: 'Primary',
      status: 'active',
      scale: '1,200 units',
    },
    {
      id: '2',
      name: 'Standard Item Beta',
      type: 'Secondary',
      status: 'maintenance',
      scale: '840 units',
    },
    { id: '3', name: 'Standard Item Gamma', type: 'Muted', status: 'inactive', scale: '150 units' },
  ];

  const columns = [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'Name', accessorKey: 'name', sortable: true },
    { header: 'Classification', accessorKey: 'type' },
    { header: 'Capacity Limit', accessorKey: 'scale' },
    {
      header: 'Badge Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span
          className={`badge ${
            row.status === 'active'
              ? 'badge-success'
              : row.status === 'maintenance'
                ? 'badge-warning'
                : 'badge-draft'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Design System Showcase</h2>
          <p className="text-xs text-text-secondary mt-1">
            Reusable component primitives, layout templates, and theme configuration systems
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="btn btn-outline text-xs flex items-center gap-2 self-start md:self-auto"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>Toggle Theme ({theme})</span>
        </button>
      </div>

      {/* Spacing & Typography Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Typography */}
        <div className="bg-brand-card border border-brand-border rounded-card p-6 space-y-4">
          <h4 className="text-sm font-semibold text-white border-b border-brand-divider pb-2">
            Typography scale
          </h4>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-text-muted font-mono block">h1 / title</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Main Header Display</h1>
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-mono block">h2 / section</span>
              <h2 className="text-xl font-bold tracking-tight">Section Header display</h2>
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-mono block">body / secondary</span>
              <p className="text-xs text-text-secondary leading-relaxed">
                Standard description paragraph copy illustrating character contrast and layout
                readability grids.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons and Badges */}
        <div className="bg-brand-card border border-brand-border rounded-card p-6 space-y-4">
          <h4 className="text-sm font-semibold text-white border-b border-brand-divider pb-2">
            Buttons & semantic badges
          </h4>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary text-xs">Primary CTA</button>
            <button className="btn btn-outline text-xs">Outline btn</button>
            <button className="btn btn-danger text-xs flex items-center gap-1.5">
              <Trash size={12} /> Delete Action
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-4">
            <span className="badge badge-success">Active / Available</span>
            <span className="badge badge-warning">Pending / Idle</span>
            <span className="badge badge-error">Suspended / Error</span>
            <span className="badge badge-info">In Progress / Dispatch</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Showcase */}
      <div>
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
          Metric Cards & Sparklines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Operational Capacity"
            value="14,200 Units"
            change="+4.8%"
            changeType="positive"
            sparklineData={[10, 12, 11, 14, 15, 13, 17]}
          />
          <StatCard
            title="System Diagnostics"
            value="2 Active Errors"
            change="Urgent attention"
            changeType="negative"
            icon={AlertTriangle}
            iconColor="text-accent-red"
            sparklineData={[0, 1, 0, 2, 1, 3, 2]}
          />
          <StatCard
            title="Assigned Workspaces"
            value="3 Active Hubs"
            change="No change"
            changeType="neutral"
            sparklineData={[3, 3, 3, 3, 3, 3, 3]}
          />
        </div>
      </div>

      {/* Interactive dialogue triggers */}
      <div className="bg-brand-card border border-brand-border rounded-card p-6">
        <h4 className="text-sm font-semibold text-white border-b border-brand-divider pb-4 mb-4">
          Modals & slide drawers
        </h4>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary text-xs">
            Open Standard Modal
          </button>
          <button onClick={() => setIsDrawerOpen(true)} className="btn btn-outline text-xs">
            Open Right Drawer
          </button>
          <button onClick={() => setIsConfirmOpen(true)} className="btn btn-danger text-xs">
            Trigger Confirmation dialog
          </button>
        </div>
      </div>

      {/* Data Grid Showcase */}
      <div>
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
          Standard Data Grid template
        </h4>
        <DataTable
          columns={columns}
          data={templateRecords}
          searchKey="name"
          searchPlaceholder="Filter template rows by name..."
        />
      </div>

      {/* Dialog Modals */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Showcase Modal">
        <p className="text-xs text-text-secondary leading-relaxed">
          This is a standard modal dialog overlay inheriting the 16px corner radius, charcoal
          backdrop filter blur, and custom close triggers.
        </p>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-divider">
          <button onClick={() => setIsModalOpen(false)} className="btn btn-outline text-xs">
            Close
          </button>
          <button onClick={() => alert('Confirmed')} className="btn btn-primary text-xs">
            Submit Action
          </button>
        </div>
      </Modal>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Showcase Details Drawer"
      >
        <div className="space-y-3 text-xs">
          <p className="text-text-secondary">
            Slide drawer panel for detailing individual row attributes without leaving context.
          </p>
          <div className="flex justify-between border-b border-brand-divider py-1.5">
            <span className="text-text-muted">Parameter Key</span>
            <span className="font-semibold text-white">Value Scale</span>
          </div>
        </div>
      </Drawer>

      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Confirm Action">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-accent-red/10 rounded-full text-accent-red">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-xs">Are you sure?</h4>
            <p className="text-xs text-text-secondary mt-1">
              This destructive action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex items-end justify-end gap-3 mt-6 pt-4 border-t border-brand-divider">
          <button onClick={() => setIsConfirmOpen(false)} className="btn btn-outline text-xs">
            Cancel
          </button>
          <button onClick={() => setIsConfirmOpen(false)} className="btn btn-danger text-xs">
            Confirm Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
