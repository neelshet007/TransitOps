'use client';

import React, { useState } from 'react';
import { Plus, Download, Trash2, FileText, BarChart2, ShieldCheck, Activity } from 'lucide-react';

import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import StatCard from '../../components/StatCard';
import { useReports } from '../../modules/reports/hooks/useReports';

export default function ReportsPage() {
  const { reports, isLoading, generateReport, deleteReport } = useReports();
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'operations',
    dateRange: 'last_30_days',
    format: 'pdf',
  });

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredReports = React.useMemo(() => {
    if (activeFilter === 'all') return reports;
    return reports.filter((r) => r.category === activeFilter);
  }, [reports, activeFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await generateReport(formData);
      setIsGenerateOpen(false);
      setFormData({
        title: '',
        category: 'operations',
        dateRange: 'last_30_days',
        format: 'pdf',
      });
    } catch (err) {
      alert('Failed to generate report');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      await deleteReport(id);
    }
  };

  const columns = [
    { header: 'Report ID', accessorKey: 'id', sortable: true },
    { header: 'Title', accessorKey: 'title', sortable: true },
    { 
      header: 'Category', 
      accessorKey: 'category',
      cell: (row: any) => (
        <span className="capitalize text-text-secondary">{row.category}</span>
      )
    },
    { header: 'Generated On', accessorKey: 'generated_date', sortable: true },
    { header: 'Author', accessorKey: 'author', sortable: true },
    { header: 'Size', accessorKey: 'size' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span
          className={`badge ${
            row.status === 'ready'
              ? 'badge-success'
              : row.status === 'processing'
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Reports & Exports</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Generate, schedule, and download operations, financial, and compliance reports.
          </p>
        </div>
        <button
          onClick={() => setIsGenerateOpen(true)}
          className="btn btn-primary self-start md:self-auto flex items-center gap-2 text-xs"
        >
          <Plus size={14} /> Generate Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Generated"
          value={reports.length}
          change="+4 this week"
          changeType="positive"
          icon={FileText}
          iconColor="text-accent-blue"
          sparklineData={[12, 14, 13, 16, 18, 19, 21]}
        />
        <StatCard
          title="Financial Reports"
          value={reports.filter(r => r.category === 'finance').length}
          change="Last generated Jun 30"
          changeType="neutral"
          icon={BarChart2}
          iconColor="text-accent-purple"
          sparklineData={[5, 5, 6, 6, 6, 7, 7]}
        />
        <StatCard
          title="Compliance Logs"
          value={reports.filter(r => r.category === 'compliance').length}
          change="100% adherence"
          changeType="positive"
          icon={ShieldCheck}
          iconColor="text-accent-green"
          sparklineData={[2, 2, 3, 3, 3, 4, 4]}
        />
        <StatCard
          title="Processing"
          value={reports.filter(r => r.status === 'processing').length}
          change="Active queues"
          changeType="neutral"
          icon={Activity}
          iconColor="text-accent-amber"
          sparklineData={[0, 1, 0, 2, 1, 0, 1]}
        />
      </div>

      {/* Filters */}
      <div
        className="flex items-center gap-2 border-b border-brand-border pb-2 select-none"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {['all', 'operations', 'finance', 'maintenance', 'compliance'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-button text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeFilter === filter
                ? 'bg-brand-card text-white border border-brand-border'
                : 'text-text-secondary hover:text-white'
            }`}
            style={
              activeFilter === filter
                ? { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }
                : {}
            }
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredReports}
        searchKey="title"
        searchPlaceholder="Search reports..."
        isLoading={isLoading}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              title="Download"
              onClick={() => alert('Downloading ' + row.title)}
              disabled={row.status !== 'ready'}
              className="p-1.5 hover:bg-brand-card rounded text-text-secondary hover:text-white transition-all disabled:opacity-50"
            >
              <Download size={14} />
            </button>
            <button
              title="Delete"
              onClick={() => handleDelete(row.id)}
              className="p-1.5 hover:bg-brand-card rounded text-text-secondary hover:text-accent-red transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      />

      {/* GENERATE REPORT MODAL */}
      <Modal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        title="Generate New Report"
        description="Configure report parameters and run data extraction"
      >
        <form onSubmit={handleGenerateSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label text-xs">Report Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g. Weekly Fleet Utilization"
              className="input-field text-xs"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Data Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field text-xs bg-brand-panel"
              >
                <option value="operations">Operations</option>
                <option value="finance">Finance</option>
                <option value="maintenance">Maintenance</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Date Range</label>
              <select
                name="dateRange"
                value={formData.dateRange}
                onChange={handleInputChange}
                className="input-field text-xs bg-brand-panel"
              >
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="this_quarter">This Quarter</option>
                <option value="ytd">Year to Date</option>
                <option value="custom">Custom Range...</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label text-xs">Export Format</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 text-xs text-white">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={formData.format === 'pdf'}
                  onChange={handleInputChange}
                  className="accent-accent-purple"
                />
                PDF Document
              </label>
              <label className="flex items-center gap-2 text-xs text-white">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={formData.format === 'csv'}
                  onChange={handleInputChange}
                  className="accent-accent-purple"
                />
                CSV Spreadsheet
              </label>
              <label className="flex items-center gap-2 text-xs text-white">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={formData.format === 'json'}
                  onChange={handleInputChange}
                  className="accent-accent-purple"
                />
                JSON Data
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-brand-divider">
            <button
              type="button"
              onClick={() => setIsGenerateOpen(false)}
              className="btn btn-outline text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary text-xs flex items-center gap-2">
              <Activity size={14} /> Run Extraction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
