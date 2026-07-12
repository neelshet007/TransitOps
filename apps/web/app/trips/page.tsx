'use client';

import React, { useState } from 'react';
import { Plus, Compass, AlertTriangle, TrendingUp } from 'lucide-react';

import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import Drawer from '../../components/Drawer';
import StatCard from '../../components/StatCard';
import { useTrips } from '../../modules/trips/hooks/useTrips';

export default function TripsPage() {
  const { trips, isLoading, createTrip } = useTrips();
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);

  // Modals / Drawer triggers
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    vehicle_id: 'veh-1000',
    driver_id: 'drv-2000',
    origin: '',
    destination: '',
    start_odometer: '85000',
    revenue: '35000',
  });

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTrips = React.useMemo(() => {
    if (activeFilter === 'all') return trips;
    return trips.filter((t) => t.status === activeFilter);
  }, [trips, activeFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTrip({
        ...formData,
        start_odometer: Number(formData.start_odometer),
        revenue: Number(formData.revenue),
        vehicle_plate: 'MH-12-Q-4521',
        driver_name: 'Rajesh K.',
      });
      setIsCreateOpen(false);
      setFormData({
        vehicle_id: 'veh-1000',
        driver_id: 'drv-2000',
        origin: '',
        destination: '',
        start_odometer: '85000',
        revenue: '35000',
      });
    } catch (err) {
      alert('Failed to dispatch trip');
    }
  };

  const columns = [
    { header: 'Trip ID', accessorKey: 'trip_number', sortable: true },
    { header: 'Vehicle Plate', accessorKey: 'vehicle_plate', sortable: true },
    { header: 'Driver', accessorKey: 'driver_name', sortable: true },
    { header: 'Origin', accessorKey: 'origin', sortable: true },
    { header: 'Destination', accessorKey: 'destination', sortable: true },
    {
      header: 'Gross Revenue',
      accessorKey: 'revenue',
      sortable: true,
      cell: (row: any) => `₹${row.revenue.toLocaleString()}`,
    },
    {
      header: 'Dispatch Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span
          className={`badge ${
            row.status === 'completed'
              ? 'badge-success'
              : row.status === 'in_progress'
                ? 'badge-info'
                : row.status === 'scheduled'
                  ? 'badge-warning'
                  : 'badge-draft'
          }`}
        >
          {row.status.replace('_', ' ')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Active Dispatches</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Schedule, dispatch, and review commercial shipping lanes and revenues
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn btn-primary self-start md:self-auto flex items-center gap-2 text-xs"
        >
          <Plus size={14} /> Dispatch Route
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Shipments"
          value={trips.length}
          change="+12 today"
          changeType="positive"
          icon={Compass}
          iconColor="text-accent-blue"
          sparklineData={[80, 85, 88, 92, 95, 98, 100]}
        />
        <StatCard
          title="In Transit"
          value={trips.filter((t) => t.status === 'in_progress').length}
          change="Connecting corridors"
          changeType="neutral"
          icon={AlertTriangle}
          iconColor="text-accent-purple"
          sparklineData={[4, 5, 6, 5, 8, 7, 8]}
        />
        <StatCard
          title="Target Revenue"
          value="₹38.5 Lakh"
          change="+4.2% vs target"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-accent-green"
          sparklineData={[30, 32, 34, 35, 36, 38, 38.5]}
        />
      </div>

      {/* Filters */}
      <div
        className="flex items-center gap-2 border-b border-brand-border pb-2 select-none"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {['all', 'scheduled', 'in_progress', 'completed', 'cancelled'].map((filter) => (
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
            {filter.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredTrips}
        searchKey="trip_number"
        searchPlaceholder="Filter by trip number..."
        isLoading={isLoading}
        onRowClick={(row) => {
          setSelectedTrip(row);
          setIsDetailOpen(true);
        }}
      />

      {/* DISPATCH TRIP MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Dispatch Active Route"
        description="Schedule a new freight carriage assignment"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Origin City</label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                required
                placeholder="Mumbai, MH"
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Destination City</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
                placeholder="Delhi, DL"
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Gross Revenue (INR)</label>
              <input
                type="number"
                name="revenue"
                value={formData.revenue}
                onChange={handleInputChange}
                required
                placeholder="35000"
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Start Odometer (km)</label>
              <input
                type="number"
                name="start_odometer"
                value={formData.start_odometer}
                onChange={handleInputChange}
                required
                placeholder="85000"
                className="input-field text-xs"
              />
            </div>
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
              Confirm Dispatch
            </button>
          </div>
        </form>
      </Modal>

      {/* DETAILS SLIDE DRAWER */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Trip Specifications"
        description="Cargo tracking and route milestones"
      >
        {selectedTrip && (
          <div className="space-y-4 text-xs select-none">
            <div
              className="flex justify-between border-b border-brand-divider py-2"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <span className="text-text-secondary">Trip ID</span>
              <span className="font-semibold text-white">{selectedTrip.trip_number}</span>
            </div>
            <div
              className="flex justify-between border-b border-brand-divider py-2"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <span className="text-text-secondary">Vehicle Plate</span>
              <span className="font-semibold text-white">{selectedTrip.vehicle_plate}</span>
            </div>
            <div
              className="flex justify-between border-b border-brand-divider py-2"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <span className="text-text-secondary">Driver</span>
              <span className="font-semibold text-white">{selectedTrip.driver_name}</span>
            </div>
            <div
              className="flex justify-between border-b border-brand-divider py-2"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <span className="text-text-secondary">Route</span>
              <span className="font-semibold text-white">
                {selectedTrip.origin} ➔ {selectedTrip.destination}
              </span>
            </div>
            <div
              className="flex justify-between border-b border-brand-divider py-2"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <span className="text-text-secondary">Start Time</span>
              <span className="font-semibold text-white">
                {new Date(selectedTrip.start_time).toLocaleString()}
              </span>
            </div>
            {selectedTrip.end_time && (
              <div
                className="flex justify-between border-b border-brand-divider py-2"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <span className="text-text-secondary">End Time</span>
                <span className="font-semibold text-white">
                  {new Date(selectedTrip.end_time).toLocaleString()}
                </span>
              </div>
            )}
            <div
              className="flex justify-between border-b border-brand-divider py-2"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <span className="text-text-secondary">Odometer (Start)</span>
              <span className="font-semibold text-white">
                {selectedTrip.start_odometer.toLocaleString()} km
              </span>
            </div>
            {selectedTrip.end_odometer && (
              <div
                className="flex justify-between border-b border-brand-divider py-2"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <span className="text-text-secondary">Odometer (End)</span>
                <span className="font-semibold text-white">
                  {selectedTrip.end_odometer.toLocaleString()} km
                </span>
              </div>
            )}
            <div
              className="flex justify-between border-b border-brand-divider py-2"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <span className="text-text-secondary">Revenue</span>
              <span className="font-semibold text-white text-accent-green">
                ₹{selectedTrip.revenue.toLocaleString()}
              </span>
            </div>
            <div
              className="flex justify-between border-b border-brand-divider py-2"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <span className="text-text-secondary">Status</span>
              <span
                className={`badge ${
                  selectedTrip.status === 'completed'
                    ? 'badge-success'
                    : selectedTrip.status === 'in_progress'
                      ? 'badge-info'
                      : 'badge-warning'
                }`}
              >
                {selectedTrip.status.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
