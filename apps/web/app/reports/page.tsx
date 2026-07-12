'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Download, Trash2, FileText, BarChart2, ShieldCheck, Activity } from 'lucide-react';

import DataTable  from '../../components/DataTable';
import Modal      from '../../components/Modal';
import StatCard   from '../../components/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import FilterBar  from '../../components/ui/FilterBar';
import FormFooter from '../../components/ui/FormFooter';
import { useReports } from '../../modules/reports/hooks/useReports';

const FILTERS = [
  { label: 'All',         value: 'all' },
  { label: 'Operations',  value: 'operations' },
  { label: 'Finance',     value: 'finance' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Compliance',  value: 'compliance' },
];

const defaultForm = { title: '', category: 'operations', dateRange: 'last_30_days', format: 'pdf' };

export default function ReportsPage() {
  const { reports, isLoading, generateReport, deleteReport } = useReports();

  const [activeFilter,  setActiveFilter]  = useState('all');
  const [isGenOpen,     setIsGenOpen]      = useState(false);
  const [submitting,    setSubmitting]     = useState(false);
  const [formData,      setFormData]       = useState(defaultForm);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return reports;
    return reports.filter((r) => r.category === activeFilter);
  }, [reports, activeFilter]);

  const filtersWithCount = useMemo(() =>
    FILTERS.map((f) => ({
      ...f,
      count: f.value === 'all' ? reports.length : reports.filter((r) => r.category === f.value).length,
    })),
  [reports]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await generateReport(formData);
      setIsGenOpen(false);
      setFormData(defaultForm);
    } catch { alert('Failed to generate report'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this report?')) await deleteReport(id);
  };

  const columns = [
    {
      header: 'Report',
      accessorKey: 'title',
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-brand-elevated border border-brand-border flex-shrink-0">
            <FileText size={13} className="text-text-muted" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-primary">{row.title}</p>
            <p className="text-2xs text-text-muted">{row.author}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (row: any) => (
        <span className="badge badge-draft capitalize">{row.category}</span>
      ),
    },
    {
      header: 'Generated',
      accessorKey: 'generated_date',
      sortable: true,
      cell: (row: any) => <span className="text-xs tabular-nums text-text-secondary">{row.generated_date}</span>,
    },
    { header: 'Size', accessorKey: 'size', cell: (row: any) => <span className="text-xs text-text-muted">{row.size}</span> },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span className={`badge ${
          row.status === 'ready'      ? 'badge-success' :
          row.status === 'processing' ? 'badge-warning' : 'badge-draft'
        }`}>{row.status}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Exports"
        description="Generate, schedule, and download operations, financial, and compliance reports"
        actions={
          <button onClick={() => setIsGenOpen(true)} className="btn btn-primary">
            <Plus size={14} /> Generate Report
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Reports"      value={reports.length}                                           change="+4 this week"         changeType="positive" icon={FileText}    iconColor="text-accent-blue-soft"   iconBg="bg-blue-500/10"   sparklineData={[12,14,13,16,18,19,21]} />
        <StatCard title="Financial Reports"  value={reports.filter(r => r.category === 'finance').length}     change="Last: Jun 30"         changeType="neutral"  icon={BarChart2}   iconColor="text-accent-purple-soft" iconBg="bg-purple-500/10" sparklineData={[5,5,6,6,6,7,7]} />
        <StatCard title="Compliance Logs"    value={reports.filter(r => r.category === 'compliance').length}  change="100% adherence"       changeType="positive" icon={ShieldCheck} iconColor="text-accent-green-soft"  iconBg="bg-green-500/10"  sparklineData={[2,2,3,3,3,4,4]} />
        <StatCard title="Processing"         value={reports.filter(r => r.status === 'processing').length}    change="Active queues"        changeType="neutral"  icon={Activity}    iconColor="text-accent-amber-soft"  iconBg="bg-amber-500/10"  sparklineData={[0,1,0,2,1,0,1]} />
      </div>

      <FilterBar filters={filtersWithCount} active={activeFilter} onChange={setActiveFilter} />

      <DataTable
        columns={columns}
        data={filtered}
        searchKey="title"
        searchPlaceholder="Search reports..."
        isLoading={isLoading}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button
              className={`btn-icon ${row.status !== 'ready' ? 'opacity-30 cursor-not-allowed' : 'hover:text-accent-blue-soft'}`}
              title="Download report"
              disabled={row.status !== 'ready'}
              onClick={() => alert(`Downloading: ${row.title}`)}
            >
              <Download size={14} />
            </button>
            <button
              className="btn-icon hover:text-accent-red-soft"
              title="Delete report"
              onClick={() => handleDelete(row.id)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      />

      <Modal isOpen={isGenOpen} onClose={() => setIsGenOpen(false)} title="Generate Report" description="Configure parameters and run data extraction">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Report Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Weekly Fleet Utilisation" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Data Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                <option value="operations">Operations</option>
                <option value="finance">Finance</option>
                <option value="maintenance">Maintenance</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date Range</label>
              <select name="dateRange" value={formData.dateRange} onChange={handleChange} className="input-field">
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="this_quarter">This Quarter</option>
                <option value="ytd">Year to Date</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label mb-2">Export Format</label>
            <div className="flex items-center gap-5">
              {['pdf', 'csv', 'json'].map((fmt) => (
                <label key={fmt} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="format" value={fmt} checked={formData.format === fmt} onChange={handleChange} className="accent-accent-purple-mid" />
                  <span className="text-xs text-text-secondary uppercase font-semibold">{fmt}</span>
                </label>
              ))}
            </div>
          </div>
          <FormFooter onCancel={() => setIsGenOpen(false)} submitLabel="Run Extraction" loading={submitting} />
        </form>
      </Modal>
    </div>
  );
}
