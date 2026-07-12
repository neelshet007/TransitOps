'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, CreditCard, Clock, CheckCircle } from 'lucide-react';

import DataTable   from '../../components/DataTable';
import Modal       from '../../components/Modal';
import StatCard    from '../../components/StatCard';
import PageHeader  from '../../components/ui/PageHeader';
import FormFooter  from '../../components/ui/FormFooter';
import { useExpenses } from '../../modules/expenses/hooks/useExpenses';
import { driverService } from '../../modules/drivers/services/driverService';
import apiClient from '../../services/apiClient';

const defaultForm = {
  category:       'Tolls',
  expense_date:   '',
  amount:         '',
  notes:          '',
  vehicle_id:     '',
  driver_id:      '',
};

export default function ExpensesPage() {
  const { expenses, isLoading, createExpense } = useExpenses();

  const [isCreateOpen,  setIsCreateOpen]  = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const [formData,      setFormData]      = useState(defaultForm);
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((p) => ({ ...p, [name]: value }));
    },
    [],
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Log Expense] Submit button clicked');
    console.log('[Log Expense] Form Validation started');
    if (!formData.expense_date || !formData.amount || !formData.category || !formData.vehicle_id) {
      console.warn('[Log Expense] Validation failed: missing date, amount, category, or vehicle');
      alert('Please fill out all required fields');
      return;
    }
    console.log('[Log Expense] Validation passed');
    setSubmitting(true);
    try {
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);

      const payload = {
        ...formData,
        amount: Number(formData.amount),
        vehicle_plate: selectedVehicle?.plate_number || 'MH-12-Q-4521'
      };

      console.log('[Log Expense] API function called with payload:', payload);
      const res = await createExpense(payload);
      console.log('[Log Expense] Response received:', res);
      console.log('[Log Expense] Success handler finished');

      setIsCreateOpen(false);
      setFormData({
        ...defaultForm,
        vehicle_id: vehicles[0]?.id || 'veh-1000',
        driver_id: drivers[0]?.id || 'drv-2000'
      });
    } catch (err) {
      console.error('[Log Expense] Error handler triggered:', err);
      alert('Failed to log expense');
    }
    finally { setSubmitting(false); }
  };

  const columns = [
    {
      header: 'Trip Code',
      accessorKey: 'trip_number',
      sortable: true,
      cell: (row: any) => (
        <span className="font-mono text-xs text-text-primary">{row.trip_number || 'OP-LOG'}</span>
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
      header: 'Category',
      accessorKey: 'category',
      sortable: true,
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      sortable: true,
      cell: (row: any) => (
        <span className="text-xs font-medium text-accent-green-soft">₹{(row.amount || 0).toLocaleString()}</span>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'expense_date',
      sortable: true,
      cell: (row: any) => (
        <span className="text-xs tabular-nums">{row.expense_date}</span>
      ),
    },
    {
      header: 'Payment',
      accessorKey: 'payment_method',
      cell: (row: any) => (
        <span className="text-xs text-text-muted">{row.payment_method || 'Corporate Card'}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span className={`badge ${
          row.status === 'approved' ? 'badge-success' :
          row.status === 'pending'  ? 'badge-warning' : 'badge-error'
        }`}>
          {row.status}
        </span>
      ),
    },
  ];

  const totalApproved = expenses.filter((e) => e.status === 'approved').reduce((s, e) => s + (e.amount || 0), 0);
  const pendingCount  = expenses.filter((e) => e.status === 'pending').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense Ledger"
        description="Audit, approve, and track fleet operating expenses — tolls, lodging, permits"
        actions={
          <button onClick={() => { console.log('[Log Expense Button] Clicked to open modal'); setIsCreateOpen(true); }} className="btn btn-primary">
            <Plus size={14} /> Log Expense
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Approved Expenses"
          value={`₹${(totalApproved / 100000).toFixed(1)}L`}
          change="Validation rate 92%"
          changeType="positive"
          icon={CheckCircle}
          iconColor="text-accent-green-soft"
          iconBg="bg-green-500/10"
          sparklineData={[1.1, 1.2, 1.2, 1.3, 1.3, 1.4, 1.4]}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingCount}
          change="Requires review"
          changeType="neutral"
          icon={Clock}
          iconColor="text-accent-amber-soft"
          iconBg="bg-amber-500/10"
          sparklineData={[8, 12, 10, 15, 11, 13, 12]}
        />
        <StatCard
          title="Fastag Balance"
          value="₹42,500"
          change="Corporate wallet"
          changeType="positive"
          icon={CreditCard}
          iconColor="text-accent-blue-soft"
          iconBg="bg-blue-500/10"
          sparklineData={[30000, 32000, 35000, 38000, 41000, 42000, 42500]}
        />
      </div>

      <DataTable
        columns={columns}
        data={expenses}
        searchKey="trip_number"
        searchPlaceholder="Search by trip number..."
        isLoading={isLoading}
      />

      {/* Log Expense Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Log Expense" description="Submit a new fleet transaction invoice">
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
              <label className="form-label">Expense Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                <option value="Tolls">Tolls</option>
                <option value="Driver Lodging">Driver Lodging</option>
                <option value="State Permits">State Permits</option>
                <option value="Scales">Scales</option>
                <option value="Emergency Repairs">Emergency Repairs</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Expense Date</label>
              <input name="expense_date" type="date" value={formData.expense_date} onChange={handleChange} required className="input-field" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input name="amount" type="number" value={formData.amount} onChange={handleChange} required placeholder="3500" className="input-field" />
          </div>
          <div className="form-group">
            <label className="form-label">Notes / Receipt Reference</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Receipt ref, fastag ID, permit number…" rows={3} className="input-field" />
          </div>
          <FormFooter onCancel={() => setIsCreateOpen(false)} submitLabel="Submit Expense" loading={submitting} />
        </form>
      </Modal>
    </div>
  );
}
