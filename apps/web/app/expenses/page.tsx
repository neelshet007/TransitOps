'use client';

import React, { useState, useCallback } from 'react';
import { Plus, CreditCard, CheckCircle, Clock } from 'lucide-react';

import DataTable  from '../../components/DataTable';
import Modal      from '../../components/Modal';
import StatCard   from '../../components/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import FormFooter from '../../components/ui/FormFooter';
import { useExpenses } from '../../modules/expenses/hooks/useExpenses';

const defaultForm = {
  trip_id:      'trp-5000',
  trip_number:  'TRP-10000',
  category:     'Tolls',
  amount:       '',
  expense_date: '',
  notes:        '',
};

export default function ExpensesPage() {
  const { expenses, isLoading, createExpense } = useExpenses();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [formData,     setFormData]     = useState(defaultForm);

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
      await createExpense({ ...formData, amount: Number(formData.amount), vehicle_plate: 'MH-12-Q-4521' });
      setIsCreateOpen(false);
      setFormData(defaultForm);
    } catch { alert('Failed to log expense'); }
    finally { setSubmitting(false); }
  };

  const columns = [
    {
      header: 'Trip Code',
      accessorKey: 'trip_number',
      sortable: true,
      cell: (row: any) => (
        <span className="font-mono text-xs text-text-primary">{row.trip_number}</span>
      ),
    },
    {
      header: 'Vehicle',
      accessorKey: 'vehicle_plate',
      sortable: true,
      cell: (row: any) => (
        <span className="font-mono text-xs text-text-secondary">{row.vehicle_plate}</span>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      sortable: true,
      cell: (row: any) => (
        <span className="badge badge-draft capitalize">{row.category}</span>
      ),
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      sortable: true,
      cell: (row: any) => (
        <span className="text-xs font-semibold text-text-primary">₹{(row.amount || 0).toLocaleString()}</span>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'expense_date',
      sortable: true,
      cell: (row: any) => (
        <span className="text-xs tabular-nums text-text-secondary">{row.expense_date}</span>
      ),
    },
    {
      header: 'Payment',
      accessorKey: 'payment_method',
      cell: (row: any) => (
        <span className="text-xs text-text-muted">{row.payment_method}</span>
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
          <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
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
