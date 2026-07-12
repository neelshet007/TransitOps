'use client';

import React, { useState } from 'react';
import { Plus, Fuel, DollarSign, Activity } from 'lucide-react';

import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import StatCard from '../../components/StatCard';
import { useFuel } from '../../modules/fuel/hooks/useFuel';

export default function FuelLogsPage() {
  const { logs, isLoading, createLog } = useFuel();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    vehicle_id: 'veh-1000',
    driver_id: 'drv-2000',
    refuel_date: '',
    gallons: '',
    cost: '',
    odometer: '',
    station_name: 'Indian Oil Retail Outlet',
    receipt_number: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLog({
        ...formData,
        gallons: Number(formData.gallons),
        cost: Number(formData.cost),
        odometer: Number(formData.odometer),
        refuel_date: new Date(formData.refuel_date).toISOString(),
        receipt_number: `REC-${Math.floor(80000 + Math.random() * 20000)}`,
      });
      setIsCreateOpen(false);
      setFormData({
        vehicle_id: 'veh-1000',
        driver_id: 'drv-2000',
        refuel_date: '',
        gallons: '',
        cost: '',
        odometer: '',
        station_name: 'Indian Oil Retail Outlet',
        receipt_number: '',
      });
    } catch (err) {
      alert('Failed to log fuel entry');
    }
  };

  const columns = [
    { header: 'Receipt', accessorKey: 'receipt_number', sortable: true },
    { header: 'Vehicle Plate', accessorKey: 'vehicle_plate', sortable: true },
    { header: 'Driver', accessorKey: 'driver_name', sortable: true },
    {
      header: 'Refuel Date',
      accessorKey: 'refuel_date',
      sortable: true,
      cell: (row: any) => new Date(row.refuel_date).toLocaleDateString(),
    },
    {
      header: 'Volume (Liters)',
      accessorKey: 'gallons',
      sortable: true,
      cell: (row: any) => `${row.gallons.toFixed(1)} L`,
    },
    {
      header: 'Total Cost',
      accessorKey: 'cost',
      sortable: true,
      cell: (row: any) => `₹${row.cost.toLocaleString()}`,
    },
    { header: 'Odometer (km)', accessorKey: 'odometer' },
    { header: 'Station Name', accessorKey: 'station_name' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Fuel Logs Registry</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Track refueling events, volumetric consumption, total costs, and odometer readings
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn btn-primary self-start md:self-auto flex items-center gap-2 text-xs"
        >
          <Plus size={14} /> Log Fuel Purchase
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Liters Refueled"
          value="14,820 L"
          change="Monthly volume"
          changeType="neutral"
          icon={Fuel}
          iconColor="text-accent-blue"
          sparklineData={[1200, 1350, 1500, 1400, 1600, 1550, 14820]}
        />
        <StatCard
          title="Average Price / Liter"
          value="₹93.5"
          change="Normal range"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-accent-green"
          sparklineData={[92, 92.5, 93, 93.5, 94, 93.8, 93.5]}
        />
        <StatCard
          title="Refueling Operations"
          value={logs.length}
          change="Logs logged"
          changeType="positive"
          icon={Activity}
          iconColor="text-accent-purple"
          sparklineData={[80, 85, 90, 88, 92, 95, 100]}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={logs}
        searchKey="vehicle_plate"
        searchPlaceholder="Filter by vehicle plate..."
        isLoading={isLoading}
      />

      {/* LOG FUEL ENTRY MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Log Refueling Event"
        description="Register fuel purchase details"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Refuel Date</label>
              <input
                type="date"
                name="refuel_date"
                value={formData.refuel_date}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Odometer Reading (km)</label>
              <input
                type="number"
                name="odometer"
                value={formData.odometer}
                onChange={handleInputChange}
                required
                placeholder="85000"
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Volume (Liters)</label>
              <input
                type="number"
                name="gallons"
                value={formData.gallons}
                onChange={handleInputChange}
                required
                placeholder="150"
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Total Cost (INR)</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                required
                placeholder="14000"
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label text-xs">Station / Pump Name</label>
            <select
              name="station_name"
              value={formData.station_name}
              onChange={handleInputChange}
              className="input-field text-xs bg-brand-panel"
            >
              <option value="Indian Oil Retail Outlet">Indian Oil Retail Outlet</option>
              <option value="Bharat Petroleum Pump">Bharat Petroleum Pump</option>
              <option value="Hindustan Petroleum Station">Hindustan Petroleum Station</option>
            </select>
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
              Log Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
