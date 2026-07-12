'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import Drawer from '../../components/Drawer';
import { useMaintenance } from '../../modules/maintenance/hooks/useMaintenance';

export default function MaintenancePage() {
  const { logs, isLoading, createLog } = useMaintenance();
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  // Modals / Drawer triggers
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    vehicle_id: 'veh-1000',
    type: 'Preventative Maintenance',
    scheduled_date: '',
    cost: '350',
    notes: '',
    service_center: 'Speedy Fleet Maintenance Services',
  });

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredLogs = React.useMemo(() => {
    if (activeFilter === 'all') return logs;
    return logs.filter((l) => l.status === activeFilter);
  }, [logs, activeFilter]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLog(formData);
      setIsCreateOpen(false);
      setFormData({
        vehicle_id: 'veh-1000',
        type: 'Preventative Maintenance',
        scheduled_date: '',
        cost: '350',
        notes: '',
        service_center: 'Speedy Fleet Maintenance Services',
      });
    } catch (err) {
      alert('Failed to schedule maintenance');
    }
  };

  const columns = [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'Vehicle', accessorKey: 'vehicle_plate', sortable: true },
    { header: 'Service Type', accessorKey: 'type', sortable: true },
    { header: 'Scheduled Date', accessorKey: 'scheduled_date', sortable: true },
    {
      header: 'Estimated Cost',
      accessorKey: 'cost',
      sortable: true,
      cell: (row: any) => `$${row.cost.toLocaleString()}`,
    },
    { header: 'Service Center', accessorKey: 'service_center' },
    {
      header: 'Service Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span
          className={`badge ${
            row.status === 'completed'
              ? 'badge-success'
              : row.status === 'in_progress'
                ? 'badge-info'
                : 'badge-warning'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Module Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Maintenance Calendar</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Schedule, dispatch, and review active vehicle service sessions and diagnostics
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn btn-primary self-start md:self-auto flex items-center gap-2 text-xs"
        >
          <Plus size={16} /> Schedule Service
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-2 select-none">
        {['all', 'scheduled', 'in_progress', 'completed'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-button text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeFilter === filter
                ? 'bg-brand-card text-white border border-brand-border'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Main Table Grid */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        searchKey="vehicle_plate"
        searchPlaceholder="Filter by vehicle plate..."
        isLoading={isLoading}
        onRowClick={(row) => {
          setSelectedLog(row);
          setIsDetailOpen(true);
        }}
      />

      {/* SCHEDULE SERVICE MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Schedule Fleet Maintenance"
        description="Book a new diagnostic or repair service log entry"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Service Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="input-field text-xs bg-brand-panel"
              >
                <option value="Preventative Maintenance">Preventative Maintenance</option>
                <option value="Brake Service">Brake Service</option>
                <option value="Tire Replacement">Tire Replacement</option>
                <option value="Engine Repair">Engine Repair</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Scheduled Date</label>
              <input
                type="date"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Service Center</label>
              <input
                type="text"
                name="service_center"
                value={formData.service_center}
                onChange={handleInputChange}
                required
                placeholder="Speedy Fleet Maintenance"
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Estimated Cost (USD)</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                required
                placeholder="350"
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label text-xs">Notes / Diagnostic details</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Detail mechanical problems, parts required, etc."
              rows={3}
              className="input-field text-xs resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-brand-divider">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="btn btn-outline text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary text-xs">
              Book Service Session
            </button>
          </div>
        </form>
      </Modal>

      {/* DETAILS SLIDE DRAWER */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Maintenance Log Details"
        description="Detailed service diagnostic logs"
      >
        {selectedLog && (
          <div className="space-y-4 text-xs select-none">
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Log ID</span>
              <span className="font-semibold text-white">{selectedLog.id}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Vehicle Plate</span>
              <span className="font-semibold text-white">{selectedLog.vehicle_plate}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Service Type</span>
              <span className="font-semibold text-white">{selectedLog.type}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Scheduled Date</span>
              <span className="font-semibold text-white">{selectedLog.scheduled_date}</span>
            </div>
            {selectedLog.completed_date && (
              <div className="flex justify-between border-b border-brand-divider py-2">
                <span className="text-text-secondary">Completed Date</span>
                <span className="font-semibold text-white">{selectedLog.completed_date}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Service Center</span>
              <span className="font-semibold text-white">{selectedLog.service_center}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Logged Cost</span>
              <span className="font-semibold text-white text-accent-green">
                ${selectedLog.cost.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col border-b border-brand-divider py-2 gap-1.5">
              <span className="text-text-secondary">Diagnostic Notes</span>
              <p className="p-3 bg-brand-panel border border-brand-border rounded text-text-secondary leading-relaxed">
                {selectedLog.notes}
              </p>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Service Status</span>
              <span
                className={`badge ${
                  selectedLog.status === 'completed'
                    ? 'badge-success'
                    : selectedLog.status === 'in_progress'
                      ? 'badge-info'
                      : 'badge-warning'
                }`}
              >
                {selectedLog.status.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
