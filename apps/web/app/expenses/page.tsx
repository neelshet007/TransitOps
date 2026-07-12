'use client';

import React, { useState } from 'react';
import { Plus, CreditCard, CheckCircle, Clock } from 'lucide-react';

import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import StatCard from '../../components/StatCard';
import { useExpenses } from '../../modules/expenses/hooks/useExpenses';

export default function ExpensesPage() {
  const { expenses, isLoading, createExpense } = useExpenses();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    trip_id: 'trp-5000',
    trip_number: 'TRP-10000',
    category: 'Tolls',
    amount: '',
    expense_date: '',
    notes: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExpense({
        ...formData,
        amount: Number(formData.amount),
        vehicle_plate: 'MH-12-Q-4521',
      });
      setIsCreateOpen(false);
      setFormData({
        trip_id: 'trp-5000',
        trip_number: 'TRP-10000',
        category: 'Tolls',
        amount: '',
        expense_date: '',
        notes: '',
      });
    } catch (err) {
      alert('Failed to log expense');
    }
  };

  const columns = [
    { header: 'Expense ID', accessorKey: 'id', sortable: true },
    { header: 'Trip Code', accessorKey: 'trip_number', sortable: true },
    { header: 'Vehicle Plate', accessorKey: 'vehicle_plate', sortable: true },
    { header: 'Category', accessorKey: 'category', sortable: true },
    {
      header: 'Amount',
      accessorKey: 'amount',
      sortable: true,
      cell: (row: any) => `₹${row.amount.toLocaleString()}`,
    },
    { header: 'Expense Date', accessorKey: 'expense_date', sortable: true },
    { header: 'Payment Method', accessorKey: 'payment_method' },
    {
      header: 'Audit Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span
          className={`badge ${
            row.status === 'approved'
              ? 'badge-success'
              : row.status === 'pending'
                ? 'badge-warning'
                : 'badge-error'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Expense Audit Ledgers</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Audit, approve, and track operations expenses (tolls, lodging, permits, maintenance
            repairs)
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn btn-primary self-start md:self-auto flex items-center gap-2 text-xs"
        >
          <Plus size={14} /> Log Expense Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Approved Expenses"
          value="₹1.4 Lakh"
          change="92% validation rate"
          changeType="positive"
          icon={CheckCircle}
          iconColor="text-accent-green"
          sparklineData={[1.1, 1.2, 1.2, 1.3, 1.3, 1.4, 1.4]}
        />
        <StatCard
          title="Pending Approvals"
          value={expenses.filter((e) => e.status === 'pending').length}
          change="Toll clearance approvals"
          changeType="neutral"
          icon={Clock}
          iconColor="text-accent-amber"
          sparklineData={[8, 12, 10, 15, 11, 13, 12]}
        />
        <StatCard
          title="Fastag RFID Balances"
          value="₹42,500"
          change="Corporate wallet"
          changeType="positive"
          icon={CreditCard}
          iconColor="text-accent-blue"
          sparklineData={[30000, 32000, 35000, 38000, 41000, 42000, 42500]}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={expenses}
        searchKey="trip_number"
        searchPlaceholder="Filter by trip number..."
        isLoading={isLoading}
      />

      {/* LOG EXPENSE MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Log Operations Expense"
        description="Submit a new fleet transaction invoice"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Expense Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field text-xs bg-brand-panel"
              >
                <option value="Tolls">Tolls</option>
                <option value="Driver Lodging">Driver Lodging</option>
                <option value="State Permits">State Permits</option>
                <option value="Scales">Scales</option>
                <option value="Emergency Repairs">Emergency Repairs</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Expense Date</label>
              <input
                type="date"
                name="expense_date"
                value={formData.expense_date}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label text-xs">Amount (INR)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              placeholder="3500"
              className="input-field text-xs"
            />
          </div>
          <div className="form-group">
            <label className="form-label text-xs">Transaction Details / Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Enter receipt references, fastag IDs, etc."
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
              Submit Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
