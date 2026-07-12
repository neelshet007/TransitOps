'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Fuel, DollarSign, Activity } from 'lucide-react';

import DataTable  from '../../components/DataTable';
import Modal      from '../../components/Modal';
import StatCard   from '../../components/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import FormFooter from '../../components/ui/FormFooter';
import { useFuel } from '../../modules/fuel/hooks/useFuel';
import { driverService } from '../../modules/drivers/services/driverService';
import apiClient from '../../services/apiClient';

const defaultForm = {
  vehicle_id:     '',
  driver_id:      '',
  refuel_date:    '',
  gallons:        '',
  cost:           '',
  odometer:       '',
  station_name:   'Indian Oil Retail Outlet',
  receipt_number: '',
};

export default function FuelLogsPage() {
  const { logs, isLoading, createLog } = useFuel();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [formData,     setFormData]     = useState(defaultForm);
  const [vehicles,     setVehicles]     = useState<any[]>([]);
  const [drivers,      setDrivers]      = useState<any[]>([]);

  // Load vehicles and drivers for selectors
  const loadSelectors = useCallback(async () => {
    try {
      const [vehiclesRes, driversRes] = await Promise.all([
        apiClient.get('/vehicles'),
        driverService.getAll({ limit: 100 })
      ]);
      const vehicleList = vehiclesRes.data?.data || [];
      const driverList = driversRes.data || [];
      setVehicles(vehicleList);
      setDrivers(driverList);
      
      setFormData(p => ({
        ...p,
        vehicle_id: vehicleList[0]?.id || 'veh-1000',
        driver_id: driverList[0]?.id || 'drv-2000'
      }));
    } catch (e) {
      console.error('Failed to load selectors data', e);
    }
  }, []);

  useEffect(() => {
    loadSelectors();
  }, [loadSelectors]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((p) => ({ ...p, [name]: value }));
    },
    [],
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Log Purchase] Submit button clicked');
    console.log('[Log Purchase] Form Validation started');
    if (!formData.refuel_date || !formData.odometer || !formData.gallons || !formData.cost || !formData.vehicle_id) {
      console.warn('[Log Purchase] Validation failed: missing date, odometer, volume, cost, or vehicle');
      alert('Please fill out all required fields');
      return;
    }
    console.log('[Log Purchase] Validation passed');
    setSubmitting(true);
    try {
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);
      const selectedDriver = drivers.find(d => d.id === formData.driver_id);

      const payload = {
        ...formData,
        gallons:        Number(formData.gallons),
        cost:           Number(formData.cost),
        odometer:       Number(formData.odometer),
        refuel_date:    new Date(formData.refuel_date).toISOString(),
        receipt_number: `REC-${Math.floor(80000 + Math.random() * 20000)}`,
        vehicle_plate:  selectedVehicle?.plate_number || 'MH-12-Q-4521',
        driver_name:    selectedDriver ? `${selectedDriver.first_name} ${selectedDriver.last_name}` : 'Assigned Driver'
      };

      console.log('[Log Purchase] API function called with payload:', payload);
      const res = await createLog(payload);
      console.log('[Log Purchase] Response received:', res);
      console.log('[Log Purchase] Success handler finished');

      setIsCreateOpen(false);
      setFormData({
        ...defaultForm,
        vehicle_id: vehicles[0]?.id || 'veh-1000',
        driver_id: drivers[0]?.id || 'drv-2000'
      });
    } catch (err) {
      console.error('[Log Purchase] Error handler triggered:', err);
      alert('Failed to log fuel entry');
    }
    finally { setSubmitting(false); }
  };

  const columns = [
    {
      header: 'Receipt #',
      accessorKey: 'receipt_number',
      sortable: true,
      cell: (row: any) => (
        <span className="font-mono text-xs font-semibold text-text-primary">{row.receipt_number}</span>
      ),
    },
    {
      header: 'Vehicle',
      accessorKey: 'vehicle_plate',
      sortable: true,
      cell: (row: any) => (
        <span className="font-mono text-xs font-semibold text-text-primary">{row.vehicle_plate}</span>
      ),
    },
    {
      header: 'Volume',
      accessorKey: 'gallons',
      sortable: true,
      cell: (row: any) => (
        <span className="text-xs tabular-nums">{(row.gallons || 0).toLocaleString()} L</span>
      ),
    },
    {
      header: 'Total Cost',
      accessorKey: 'cost',
      sortable: true,
      cell: (row: any) => (
        <span className="text-xs font-medium text-accent-green-soft">₹{(row.cost || 0).toLocaleString()}</span>
      ),
    },
    {
      header: 'Odometer',
      accessorKey: 'odometer',
      cell: (row: any) => (
        <span className="text-xs tabular-nums text-text-secondary">{(row.odometer || 0).toLocaleString()} km</span>
      ),
    },
    {
      header: 'Station',
      accessorKey: 'station_name',
      cell: (row: any) => (
        <span className="text-xs text-text-secondary truncate block max-w-[140px]">{row.station_name}</span>
      ),
    },
  ];

  const totalLiters  = logs.reduce((s, l) => s + (l.gallons || 0), 0);
  const totalCost    = logs.reduce((s, l) => s + (l.cost || 0), 0);
  const avgPrice     = totalLiters > 0 ? totalCost / totalLiters : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fuel Logs"
        description="Track refuelling events, volumetric consumption, and operational costs"
        actions={
          <button onClick={() => { console.log('[Log Purchase Button] Clicked to open modal'); setIsCreateOpen(true); }} className="btn btn-primary">
            <Plus size={14} /> Log Purchase
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Litres Refuelled"
          value={`${totalLiters.toLocaleString('en-IN', { maximumFractionDigits: 0 })} L`}
          change="Monthly volume"
          changeType="neutral"
          icon={Fuel}
          iconColor="text-accent-blue-soft"
          iconBg="bg-blue-500/10"
          sparklineData={[1200, 1350, 1500, 1400, 1600, 1550, 1500]}
        />
        <StatCard
          title="Avg Price / Litre"
          value={`₹${avgPrice.toFixed(1)}`}
          change="Market rate"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-accent-green-soft"
          iconBg="bg-green-500/10"
          sparklineData={[92, 92.5, 93, 93.5, 94, 93.8, 93.5]}
        />
        <StatCard
          title="Refuelling Events"
          value={logs.length}
          change="Logs recorded"
          changeType="positive"
          icon={Activity}
          iconColor="text-accent-purple-soft"
          iconBg="bg-purple-500/10"
          sparklineData={[80, 85, 90, 88, 92, 95, 100]}
        />
      </div>

      <DataTable
        columns={columns}
        data={logs}
        searchKey="vehicle_plate"
        searchPlaceholder="Search by vehicle plate..."
        isLoading={isLoading}
      />

      {/* Log Fuel Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Log Refuelling Event" description="Register a fuel purchase transaction">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Available Vehicle</label>
              <select name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} required className="input-field">
                {vehicles.length === 0 ? (
                  <option value="">No vehicles available</option>
                ) : (
                  vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.plate_number} ({v.make} {v.model})</option>
                  ))
                )}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Driver</label>
              <select name="driver_id" value={formData.driver_id} onChange={handleChange} required className="input-field">
                {drivers.length === 0 ? (
                  <option value="">No drivers available</option>
                ) : (
                  drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.first_name} {d.last_name}</option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Refuel Date</label>
              <input name="refuel_date" type="date" value={formData.refuel_date} onChange={handleChange} required className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Odometer Reading (km)</label>
              <input name="odometer" type="number" value={formData.odometer} onChange={handleChange} required placeholder="85000" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Volume (Litres)</label>
              <input name="gallons" type="number" value={formData.gallons} onChange={handleChange} required placeholder="150" className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Total Cost (₹)</label>
              <input name="cost" type="number" value={formData.cost} onChange={handleChange} required placeholder="14000" className="input-field" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Fuel Station</label>
            <select name="station_name" value={formData.station_name} onChange={handleChange} className="input-field">
              <option value="Indian Oil Retail Outlet">Indian Oil Retail Outlet</option>
              <option value="Bharat Petroleum Pump">Bharat Petroleum Pump</option>
              <option value="Hindustan Petroleum Station">Hindustan Petroleum Station</option>
            </select>
          </div>
          <FormFooter onCancel={() => setIsCreateOpen(false)} submitLabel="Log Transaction" loading={submitting} />
        </form>
      </Modal>
    </div>
  );
}
