'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Compass, AlertTriangle, TrendingUp } from 'lucide-react';

import DataTable    from '../../components/DataTable';
import Modal        from '../../components/Modal';
import Drawer       from '../../components/Drawer';
import StatCard     from '../../components/StatCard';
import PageHeader   from '../../components/ui/PageHeader';
import FilterBar    from '../../components/ui/FilterBar';
import InfoRow      from '../../components/ui/InfoRow';
import InfoSection  from '../../components/ui/InfoSection';
import FormFooter   from '../../components/ui/FormFooter';
import { useTrips } from '../../modules/trips/hooks/useTrips';

const FILTERS = [
  { label: 'All',         value: 'all' },
  { label: 'Scheduled',   value: 'scheduled' },
  { label: 'In Transit',  value: 'in_progress' },
  { label: 'Completed',   value: 'completed' },
  { label: 'Cancelled',   value: 'cancelled' },
];

const defaultForm = {
  vehicle_id:      'veh-1000',
  driver_id:       'drv-2000',
  origin:          '',
  destination:     '',
  start_odometer:  '85000',
  revenue:         '35000',
};

export default function TripsPage() {
  const { trips, isLoading, createTrip } = useTrips();

  const [selected,      setSelected]      = useState<any | null>(null);
  const [activeFilter,  setActiveFilter]  = useState('all');
  const [isCreateOpen,  setIsCreateOpen]  = useState(false);
  const [isDetailOpen,  setIsDetailOpen]  = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const [formData,      setFormData]      = useState(defaultForm);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return trips;
    return trips.filter((t) => t.status === activeFilter);
  }, [trips, activeFilter]);

  const filtersWithCount = useMemo(() =>
    FILTERS.map((f) => ({
      ...f,
      count: f.value === 'all' ? trips.length : trips.filter((t) => t.status === f.value).length,
    })),
  [trips]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTrip({
        ...formData,
        start_odometer: Number(formData.start_odometer),
        revenue:        Number(formData.revenue),
        vehicle_plate:  'MH-12-Q-4521',
        driver_name:    'Rajesh K.',
      });
      setIsCreateOpen(false);
      setFormData(defaultForm);
    } catch { alert('Failed to dispatch trip'); }
    finally { setSubmitting(false); }
  };

  const columns = [
    {
      header: 'Trip ID',
      accessorKey: 'trip_number',
      sortable: true,
      cell: (row: any) => (
        <span className="font-mono text-xs font-semibold text-text-primary">{row.trip_number}</span>
      ),
    },
    {
      header: 'Route',
      accessorKey: 'origin',
      cell: (row: any) => (
        <div>
          <p className="text-xs font-medium text-text-primary">{row.origin}</p>
          <p className="text-2xs text-text-muted">→ {row.destination}</p>
        </div>
      ),
    },
    {
      header: 'Vehicle',
      accessorKey: 'vehicle_plate',
      cell: (row: any) => (
        <span className="font-mono text-xs text-text-secondary">{row.vehicle_plate}</span>
      ),
    },
    {
      header: 'Driver',
      accessorKey: 'driver_name',
      sortable: true,
    },
    {
      header: 'Revenue',
      accessorKey: 'revenue',
      sortable: true,
      cell: (row: any) => (
        <span className="text-xs font-semibold text-accent-green-soft">
          ₹{(row.revenue || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span className={`badge ${
          row.status === 'completed'   ? 'badge-success' :
          row.status === 'in_progress' ? 'badge-info'    :
          row.status === 'scheduled'   ? 'badge-warning' : 'badge-draft'
        }`}>
          {row.status.replace('_', ' ')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Active Dispatches"
        description="Schedule, dispatch, and review commercial shipping lanes and revenues"
        actions={
          <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
            <Plus size={14} /> Dispatch Route
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Shipments"
          value={trips.length}
          change="+12 today"
          changeType="positive"
          icon={Compass}
          iconColor="text-accent-blue-soft"
          iconBg="bg-blue-500/10"
          sparklineData={[80, 85, 88, 92, 95, 98, 100]}
        />
        <StatCard
          title="In Transit"
          value={trips.filter((t) => t.status === 'in_progress').length}
          change="Active corridors"
          changeType="neutral"
          icon={AlertTriangle}
          iconColor="text-accent-purple-soft"
          iconBg="bg-purple-500/10"
          sparklineData={[4, 5, 6, 5, 8, 7, 8]}
        />
        <StatCard
          title="Target Revenue"
          value="₹38.5L"
          change="+4.2% vs target"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-accent-green-soft"
          iconBg="bg-green-500/10"
          sparklineData={[30, 32, 34, 35, 36, 38, 38.5]}
        />
      </div>

      <FilterBar filters={filtersWithCount} active={activeFilter} onChange={setActiveFilter} />

      <DataTable
        columns={columns}
        data={filtered}
        searchKey="trip_number"
        searchPlaceholder="Search by trip number..."
        isLoading={isLoading}
        onRowClick={(row) => { setSelected(row); setIsDetailOpen(true); }}
      />

      {/* Dispatch Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Dispatch Route" description="Assign a vehicle and driver to a new freight corridor">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Origin</label>
              <input name="origin" value={formData.origin} onChange={handleChange} required placeholder="Mumbai, MH" className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Destination</label>
              <input name="destination" value={formData.destination} onChange={handleChange} required placeholder="Delhi, DL" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Gross Revenue (₹)</label>
              <input name="revenue" type="number" value={formData.revenue} onChange={handleChange} required placeholder="35000" className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Start Odometer (km)</label>
              <input name="start_odometer" type="number" value={formData.start_odometer} onChange={handleChange} required placeholder="85000" className="input-field" />
            </div>
          </div>
          <FormFooter onCancel={() => setIsCreateOpen(false)} submitLabel="Confirm Dispatch" loading={submitting} />
        </form>
      </Modal>

      {/* Detail Drawer */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelected(null); }}
        title={selected?.trip_number ?? 'Trip Details'}
        description={selected ? `${selected.origin} → ${selected.destination}` : ''}
      >
        {selected && (
          <InfoSection title="Trip Information">
            <InfoRow label="Trip ID"         value={selected.trip_number} mono />
            <InfoRow label="Vehicle"         value={selected.vehicle_plate} mono />
            <InfoRow label="Driver"          value={selected.driver_name} />
            <InfoRow label="Route"           value={`${selected.origin} → ${selected.destination}`} />
            <InfoRow label="Start Time"      value={selected.start_time ? new Date(selected.start_time).toLocaleString() : '—'} />
            <InfoRow label="End Time"        value={selected.end_time ? new Date(selected.end_time).toLocaleString() : '—'} />
            <InfoRow label="Start Odometer"  value={`${(selected.start_odometer || 0).toLocaleString()} km`} />
            <InfoRow label="End Odometer"    value={selected.end_odometer ? `${selected.end_odometer.toLocaleString()} km` : '—'} />
            <InfoRow label="Revenue"         value={
              <span className="text-accent-green-soft font-semibold">₹{(selected.revenue || 0).toLocaleString()}</span>
            } />
            <InfoRow label="Status" value={
              <span className={`badge ${
                selected.status === 'completed' ? 'badge-success' :
                selected.status === 'in_progress' ? 'badge-info' : 'badge-warning'
              }`}>{selected.status.replace('_', ' ')}</span>
            } />
          </InfoSection>
        )}
      </Drawer>
    </div>
  );
}
