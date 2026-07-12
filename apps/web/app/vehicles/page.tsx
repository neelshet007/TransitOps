'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Edit, Trash2, Truck, AlertTriangle, TrendingUp } from 'lucide-react';

import DataTable   from '../../components/DataTable';
import Modal       from '../../components/Modal';
import Drawer      from '../../components/Drawer';
import StatCard    from '../../components/StatCard';
import PageHeader  from '../../components/ui/PageHeader';
import FilterBar   from '../../components/ui/FilterBar';
import InfoRow     from '../../components/ui/InfoRow';
import InfoSection from '../../components/ui/InfoSection';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FormFooter  from '../../components/ui/FormFooter';
import { useVehicles } from '../../modules/vehicles/hooks/useVehicles';

const FILTERS = [
  { label: 'All',         value: 'all' },
  { label: 'Active',      value: 'active' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Inactive',    value: 'inactive' },
];

const defaultForm = {
  plate_number:    '',
  make:            'Tata',
  model:           'Signa 4825.T',
  year:            '2023',
  vin:             '',
  status:          'active',
  current_mileage: '',
};

export default function VehiclesPage() {
  const { vehicles, isLoading, createVehicle, updateVehicle, deleteVehicle } = useVehicles();

  const [selected,      setSelected]      = useState<any | null>(null);
  const [activeFilter,  setActiveFilter]  = useState('all');
  const [isCreateOpen,  setIsCreateOpen]  = useState(false);
  const [isEditOpen,    setIsEditOpen]    = useState(false);
  const [isDeleteOpen,  setIsDeleteOpen]  = useState(false);
  const [isDetailOpen,  setIsDetailOpen]  = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const [formData,      setFormData]      = useState(defaultForm);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return vehicles;
    return vehicles.filter((v) => v.status === activeFilter);
  }, [vehicles, activeFilter]);

  const filtersWithCount = useMemo(() =>
    FILTERS.map((f) => ({
      ...f,
      count: f.value === 'all' ? vehicles.length : vehicles.filter((v) => v.status === f.value).length,
    })),
  [vehicles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(defaultForm);
    setSelected(null);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Add Vehicle] Submit button clicked');
    console.log('[Add Vehicle] Form Validation started');
    if (!formData.plate_number || !formData.make || !formData.model || !formData.year || !formData.vin) {
      console.warn('[Add Vehicle] Validation failed: missing required fields');
      alert('Please fill out all required fields');
      return;
    }
    console.log('[Add Vehicle] Validation passed');
    setSubmitting(true);
    try {
      console.log('[Add Vehicle] API function called with payload:', formData);
      const res = await createVehicle(formData);
      console.log('[Add Vehicle] Response received:', res);
      console.log('[Add Vehicle] Success handler triggered');
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      console.error('[Add Vehicle] Error handler triggered:', err);
      alert('Failed to register vehicle');
    }
    finally { setSubmitting(false); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Edit Vehicle] Submit button clicked');
    if (!selected) {
      console.warn('[Edit Vehicle] No vehicle selected');
      return;
    }
    console.log('[Edit Vehicle] Validation started');
    if (!formData.plate_number || !formData.make || !formData.model || !formData.year || !formData.vin) {
      console.warn('[Edit Vehicle] Validation failed');
      alert('Please fill out all required fields');
      return;
    }
    console.log('[Edit Vehicle] Validation passed');
    setSubmitting(true);
    try {
      console.log('[Edit Vehicle] API function called with payload:', formData);
      const res = await updateVehicle(selected.id, formData);
      console.log('[Edit Vehicle] Response received:', res);
      console.log('[Edit Vehicle] Success handler triggered');
      setIsEditOpen(false);
      resetForm();
    } catch (err) {
      console.error('[Edit Vehicle] Error handler triggered:', err);
      alert('Failed to update vehicle');
    }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    console.log('[Delete Vehicle] Confirm button clicked');
    if (!selected) {
      console.warn('[Delete Vehicle] No vehicle selected');
      return;
    }
    setSubmitting(true);
    try {
      console.log('[Delete Vehicle] API function called for ID:', selected.id);
      await deleteVehicle(selected.id);
      console.log('[Delete Vehicle] Success handler triggered');
      setIsDeleteOpen(false);
      setSelected(null);
    } catch (err) {
      console.error('[Delete Vehicle] Error handler triggered:', err);
      alert('Failed to remove vehicle');
    }
    finally { setSubmitting(false); }
  };

  const columns = [
    {
      header: 'Plate Number',
      accessorKey: 'plate_number',
      sortable: true,
      cell: (row: any) => (
        <span className="font-mono text-xs font-semibold text-text-primary">{row.plate_number}</span>
      ),
    },
    {
      header: 'Make & Model',
      accessorKey: 'make',
      sortable: true,
      cell: (row: any) => (
        <div>
          <p className="font-medium text-text-primary text-xs">{row.make} {row.model}</p>
          <p className="text-2xs text-text-muted">Year: {row.year}</p>
        </div>
      ),
    },
    {
      header: 'VIN',
      accessorKey: 'vin',
      cell: (row: any) => (
        <span className="font-mono text-2xs text-text-secondary truncate block max-w-[140px]">{row.vin}</span>
      ),
    },
    {
      header: 'Odometer',
      accessorKey: 'current_mileage',
      sortable: true,
      cell: (row: any) => (
        <span className="text-xs tabular-nums">{(row.current_mileage || 0).toLocaleString()} km</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span className={`badge ${
          row.status === 'active'      ? 'badge-success' :
          row.status === 'maintenance' ? 'badge-warning' : 'badge-draft'
        }`}>
          {row.status}
        </span>
      ),
    },
  ];

  const VehicleForm = ({ onSubmit, onClose, loading }: { onSubmit: (e: React.FormEvent) => void; onClose: () => void; loading: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Plate Number</label>
          <input name="plate_number" value={formData.plate_number} onChange={handleChange} required placeholder="MH-12-Q-4521" className="input-field" />
        </div>
        <div className="form-group">
          <label className="form-label">Make</label>
          <input name="make" value={formData.make} onChange={handleChange} required placeholder="Tata" className="input-field" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Model</label>
          <input name="model" value={formData.model} onChange={handleChange} required placeholder="Signa 4825.T" className="input-field" />
        </div>
        <div className="form-group">
          <label className="form-label">Manufacture Year</label>
          <input name="year" type="number" value={formData.year} onChange={handleChange} required placeholder="2023" className="input-field" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">VIN</label>
        <input name="vin" value={formData.vin} onChange={handleChange} required placeholder="MBL12TATA..." className="input-field font-mono" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Odometer (km)</label>
          <input name="current_mileage" type="number" value={formData.current_mileage} onChange={handleChange} required placeholder="85000" className="input-field" />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="input-field">
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <FormFooter onCancel={onClose} loading={loading} />
    </form>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Fleet"
        description="Register, audit, and manage commercial carriage assets"
        actions={
          <button onClick={() => { console.log('[Add Vehicle Button] Clicked to open modal'); resetForm(); setIsCreateOpen(true); }} className="btn btn-primary">
            <Plus size={14} /> Add Vehicle
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Fleet"
          value={vehicles.length}
          change="+2 registered"
          changeType="positive"
          icon={Truck}
          iconColor="text-accent-blue-soft"
          iconBg="bg-blue-500/10"
          sparklineData={[46, 47, 47, 48, 48, 49, 50]}
        />
        <StatCard
          title="Under Maintenance"
          value={vehicles.filter((v) => v.status === 'maintenance').length}
          change="Scheduled diagnostics"
          changeType="neutral"
          icon={AlertTriangle}
          iconColor="text-accent-amber-soft"
          iconBg="bg-amber-500/10"
          sparklineData={[4, 5, 4, 3, 2, 4, 3]}
        />
        <StatCard
          title="Active Ratio"
          value={vehicles.length ? `${Math.round((vehicles.filter(v => v.status === 'active').length / vehicles.length) * 100)}%` : '—'}
          change="Fleet utilisation"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-accent-green-soft"
          iconBg="bg-green-500/10"
          sparklineData={[80, 81, 82, 83, 83.5, 84, 84]}
        />
      </div>

      {/* Filters */}
      <FilterBar filters={filtersWithCount} active={activeFilter} onChange={setActiveFilter} />

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        searchKey="plate_number"
        searchPlaceholder="Search by plate number..."
        isLoading={isLoading}
        onRowClick={(row) => { setSelected(row); setIsDetailOpen(true); }}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button
              className="btn-icon"
              title="Edit vehicle"
              onClick={(e) => {
                e.stopPropagation();
                console.log('[Edit Vehicle Button] Clicked for ID:', row.id);
                setSelected(row);
                setFormData({
                  plate_number:    row.plate_number,
                  make:            row.make,
                  model:           row.model,
                  year:            String(row.year),
                  vin:             row.vin,
                  status:          row.status,
                  current_mileage: String(row.current_mileage),
                });
                setIsEditOpen(true);
              }}
            >
              <Edit size={14} />
            </button>
            <button
              className="btn-icon hover:text-accent-red-soft"
              title="Delete vehicle"
              onClick={(e) => {
                e.stopPropagation();
                console.log('[Delete Vehicle Button] Clicked for ID:', row.id);
                setSelected(row);
                setIsDeleteOpen(true);
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      />

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetForm(); }} title="Register Vehicle" description="Add a new commercial truck to the fleet registry">
        <VehicleForm onSubmit={handleCreate} onClose={() => { setIsCreateOpen(false); resetForm(); }} loading={submitting} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); resetForm(); }} title="Edit Vehicle" description="Update vehicle specifications">
        <VehicleForm onSubmit={handleEdit} onClose={() => { setIsEditOpen(false); resetForm(); }} loading={submitting} />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Remove Vehicle"
        confirmLabel="Remove Vehicle"
        loading={submitting}
        description={
          <>Removing <strong className="text-text-primary">{selected?.plate_number}</strong> will permanently delete all associated records. This cannot be undone.</>
        }
      />

      {/* Detail Drawer */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelected(null); }}
        title={selected?.plate_number ?? 'Vehicle Details'}
        description={selected ? `${selected.make} ${selected.model} · ${selected.year}` : ''}
      >
        {selected && (
          <InfoSection title="Vehicle Specifications">
            <InfoRow label="Plate Number"    value={selected.plate_number} mono />
            <InfoRow label="Make / Model"    value={`${selected.make} ${selected.model}`} />
            <InfoRow label="Year"            value={selected.year} />
            <InfoRow label="VIN"             value={selected.vin} mono />
            <InfoRow label="Odometer"        value={`${(selected.current_mileage || 0).toLocaleString()} km`} />
            <InfoRow label="Last Serviced"   value={selected.last_service_date ?? '—'} />
            <InfoRow label="Status"          value={
              <span className={`badge ${selected.status === 'active' ? 'badge-success' : selected.status === 'maintenance' ? 'badge-warning' : 'badge-draft'}`}>
                {selected.status}
              </span>
            } />
          </InfoSection>
        )}
      </Drawer>
    </div>
  );
}
