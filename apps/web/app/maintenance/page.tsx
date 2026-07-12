'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Wrench, AlertTriangle, Calendar } from 'lucide-react';

import DataTable     from '../../components/DataTable';
import Modal         from '../../components/Modal';
import Drawer        from '../../components/Drawer';
import StatCard      from '../../components/StatCard';
import PageHeader    from '../../components/ui/PageHeader';
import FilterBar     from '../../components/ui/FilterBar';
import InfoRow       from '../../components/ui/InfoRow';
import InfoSection   from '../../components/ui/InfoSection';
import FormFooter    from '../../components/ui/FormFooter';
import { useMaintenance } from '../../modules/maintenance/hooks/useMaintenance';

const FILTERS = [
  { label: 'All',         value: 'all' },
  { label: 'Scheduled',   value: 'scheduled' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed',   value: 'completed' },
];

const defaultForm = {
  vehicle_id:     'veh-1000',
  type:           'Preventative Maintenance',
  scheduled_date: '',
  cost:           '4500',
  notes:          '',
  service_center: 'Tata Authorized Service Station',
};

export default function MaintenancePage() {
  const { logs, isLoading, createLog } = useMaintenance();

  const [selected,      setSelected]      = useState<any | null>(null);
  const [activeFilter,  setActiveFilter]  = useState('all');
  const [isCreateOpen,  setIsCreateOpen]  = useState(false);
  const [isDetailOpen,  setIsDetailOpen]  = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const [formData,      setFormData]      = useState(defaultForm);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return logs;
    return logs.filter((l) => l.status === activeFilter);
  }, [logs, activeFilter]);

  const filtersWithCount = useMemo(() =>
    FILTERS.map((f) => ({
      ...f,
      count: f.value === 'all' ? logs.length : logs.filter((l) => l.status === f.value).length,
    })),
  [logs]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((p) => ({ ...p, [name]: value }));
    },
    [],
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createLog(formData);
      setIsCreateOpen(false);
      setFormData(defaultForm);
    } catch { alert('Failed to schedule maintenance'); }
    finally { setSubmitting(false); }
  };

  const columns = [
    {
      header: 'Vehicle',
      accessorKey: 'vehicle_plate',
      sortable: true,
      cell: (row: any) => (
        <span className="font-mono text-xs font-semibold text-text-primary">{row.vehicle_plate}</span>
      ),
    },
    {
      header: 'Service Type',
      accessorKey: 'type',
      sortable: true,
    },
    {
      header: 'Scheduled',
      accessorKey: 'scheduled_date',
      sortable: true,
      cell: (row: any) => (
        <span className="text-xs tabular-nums">{row.scheduled_date}</span>
      ),
    },
    {
      header: 'Service Center',
      accessorKey: 'service_center',
      cell: (row: any) => (
        <span className="text-xs text-text-secondary truncate block max-w-[160px]">{row.service_center}</span>
      ),
    },
    {
      header: 'Cost',
      accessorKey: 'cost',
      sortable: true,
      cell: (row: any) => (
        <span className="text-xs font-medium text-accent-green-soft">₹{(row.cost || 0).toLocaleString()}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span className={`badge ${
          row.status === 'completed'   ? 'badge-success' :
          row.status === 'in_progress' ? 'badge-info'    : 'badge-warning'
        }`}>
          {row.status.replace('_', ' ')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Logs"
        description="Schedule, track, and review vehicle diagnostic sessions and repairs"
        actions={
          <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
            <Plus size={14} /> Book Session
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="In Repair"
          value={logs.filter((l) => l.status === 'in_progress').length}
          change="At service bay"
          changeType="neutral"
          icon={Wrench}
          iconColor="text-accent-blue-soft"
          iconBg="bg-blue-500/10"
          sparklineData={[2, 3, 2, 4, 3, 3, 3]}
        />
        <StatCard
          title="Upcoming Service"
          value={logs.filter((l) => l.status === 'scheduled').length}
          change="Booked this week"
          changeType="neutral"
          icon={Calendar}
          iconColor="text-accent-amber-soft"
          iconBg="bg-amber-500/10"
          sparklineData={[4, 5, 4, 3, 5, 4, 4]}
        />
        <StatCard
          title="Completed"
          value={logs.filter((l) => l.status === 'completed').length}
          change="All-time serviced"
          changeType="positive"
          icon={Wrench}
          iconColor="text-accent-green-soft"
          iconBg="bg-green-500/10"
          sparklineData={[30, 32, 35, 38, 41, 44, 44]}
        />
      </div>

      <FilterBar filters={filtersWithCount} active={activeFilter} onChange={setActiveFilter} />

      <DataTable
        columns={columns}
        data={filtered}
        searchKey="vehicle_plate"
        searchPlaceholder="Search by vehicle plate..."
        isLoading={isLoading}
        onRowClick={(row) => { setSelected(row); setIsDetailOpen(true); }}
      />

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Schedule Maintenance" description="Book a new diagnostic or repair service entry">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Service Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                <option value="Preventative Maintenance">Preventative Maintenance</option>
                <option value="Brake Service">Brake Service</option>
                <option value="Tire Replacement">Tire Replacement</option>
                <option value="Engine Repair">Engine Repair</option>
                <option value="Oil Change">Oil Change</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Scheduled Date</label>
              <input name="scheduled_date" type="date" value={formData.scheduled_date} onChange={handleChange} required className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Service Center</label>
              <input name="service_center" value={formData.service_center} onChange={handleChange} required placeholder="Tata Authorized Station" className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Cost (₹)</label>
              <input name="cost" type="number" value={formData.cost} onChange={handleChange} required placeholder="4500" className="input-field" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes / Details</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Detail mechanical problems, parts required…" rows={3} className="input-field" />
          </div>
          <FormFooter onCancel={() => setIsCreateOpen(false)} submitLabel="Book Session" loading={submitting} />
        </form>
      </Modal>

      {/* Detail Drawer */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelected(null); }}
        title={selected?.vehicle_plate ?? 'Maintenance Log'}
        description={selected?.type ?? ''}
      >
        {selected && (
          <InfoSection title="Service Details">
            <InfoRow label="Log ID"          value={selected.id} mono />
            <InfoRow label="Vehicle"         value={selected.vehicle_plate} mono />
            <InfoRow label="Service Type"    value={selected.type} />
            <InfoRow label="Service Center"  value={selected.service_center} />
            <InfoRow label="Scheduled Date"  value={selected.scheduled_date} />
            <InfoRow label="Completed Date"  value={selected.completed_date ?? '—'} />
            <InfoRow label="Cost"            value={
              <span className="text-accent-green-soft font-semibold">₹{(selected.cost || 0).toLocaleString()}</span>
            } />
            <InfoRow label="Status" value={
              <span className={`badge ${
                selected.status === 'completed' ? 'badge-success' :
                selected.status === 'in_progress' ? 'badge-info' : 'badge-warning'
              }`}>{selected.status.replace('_', ' ')}</span>
            } />
            {selected.notes && (
              <div className="pt-3">
                <p className="text-2xs text-text-muted mb-2 uppercase tracking-wider font-semibold">Notes</p>
                <p className="text-xs text-text-secondary leading-relaxed bg-brand-panel rounded-lg p-3 border border-brand-border">
                  {selected.notes}
                </p>
              </div>
            )}
          </InfoSection>
        )}
      </Drawer>
    </div>
  );
}
